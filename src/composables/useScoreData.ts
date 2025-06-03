import type { Socket } from 'socket.io-client';
import { xpScore, feedbackScore, dailyConsumption } from './scoreState';
import { dormID } from './shopState';
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { HourlyConsumption} from './statsTypes';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const stats: Ref<HourlyConsumption[]> = ref([]);

function isDataFresh(key: string): boolean {
  const timestamp = sessionStorage.getItem(`${key}_timestamp`);
  return timestamp ? (Date.now() - parseInt(timestamp)) < SIX_HOURS_MS : false;
}

function getSessionData<T>(key: string): T | null {
  const data = sessionStorage.getItem(key);
  if (data && isDataFresh(key)) {
    return JSON.parse(data);
  }
  return null;
}

function setSessionData<T>(key: string, value: T): void {
  sessionStorage.setItem(key, JSON.stringify(value));
  sessionStorage.setItem(`${key}_timestamp`, Date.now().toString());
}

export function useScoreData(socket: Socket) {
  // Try to load from sessionStorage
  const cachedXp = getSessionData<number>('xpScore');
  const cachedFeedback = getSessionData<number>('feedbackScore');
  const cachedConsumption = getSessionData<number>('dailyConsumption');

  if (cachedXp !== null) xpScore.value = cachedXp;
  if (cachedFeedback !== null) feedbackScore.value = cachedFeedback;
  if (cachedConsumption !== null) dailyConsumption.value = cachedConsumption;

  // If any of the data is missing or outdated, emit events and update sessionStorage
  if (cachedXp === null) {
    socket.emit('getXp', dormID.value);
    socket.off('xp').on('xp', (data) => {
      console.log('XP update received:', data);
      xpScore.value = data;
      setSessionData('xpScore', data);
    });
  }

  if (cachedFeedback === null) {
    socket.emit('getFeedback', dormID.value);
    socket.off('feedback:update').on('feedback:update', (updatedFeedbackScore) => {
      const roundedScore = Math.round(updatedFeedbackScore.feedbackScore);
      feedbackScore.value = roundedScore;
      setSessionData('feedbackScore', roundedScore);
    });
  }

  if (cachedConsumption === null) {
    socket.emit('getStats', dormID.value);
    socket.off('stats:update').on('stats:update', ({ stats24h }) => {
      stats.value = stats24h;
      setSessionData('dailyConsumption', stats.value);
    });
  }

  return {
    xpScore,
    feedbackScore,
    stats
  };
}
