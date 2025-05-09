import type { Socket } from 'socket.io-client';
import { xpScore, feedbackScore, dailyConsumption } from './scoreState';
import { dormID } from './shopState';

export function useScoreData(socket: Socket) {
  socket.off('feedback:update').on('feedback:update', (updatedFeedbackScore) => {
    feedbackScore.value = Math.round(updatedFeedbackScore.feedbackScore);
    console.log('📥 Received updated feedback score:', updatedFeedbackScore.feedbackScore);
  });

  socket.off('xp:update').on('xp:update', ({ updatedXP }) => {
    console.log('📥 Received XP update:', updatedXP);
    xpScore.value = updatedXP;
  });

  socket.off('stats:update').on('stats:update', ({ stats }) => {
    console.log('📥 Received stats update:', stats);
    dailyConsumption.value = stats.consumptionStats24h;
  });

  socket.off('xp').on('xp', (data) => {
    console.log('📥 Received XP data:', data);
    xpScore.value = data;
  });

  socket.emit('getXp', dormID.value);
  socket.emit('getFeedback', dormID.value);
  socket.emit('getDbWaterData', dormID.value);

  console.log('Requesting XP, feedback and water data... with dormID:', dormID.value);

  return {
    xpScore,
    feedbackScore,
    dailyConsumption,
  };
}
