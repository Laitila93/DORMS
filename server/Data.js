'use strict';
import { readFileSync } from "fs";
import { server } from "typescript";

function Data() {
  this.games = {};
}

// Check if a game exists
Data.prototype.gameExists = function (gameId) {
  return typeof this.games[gameId] !== "undefined";
};

// Get scores for a game
Data.prototype.getScores = function (gameId) {
  return this.games[gameId]?.scores || [];
};

// Get UI labels based on language
Data.prototype.getMenuData = function (lang) {
  if (!["en", "sv"].includes(lang)) lang = "en"; // Default to English
  const labelsPath = `./server/data/menu-${lang}.json`;
  try {
    const labels = readFileSync(labelsPath, "utf-8");
    return JSON.parse(labels);
  } catch (error) {
    console.error(`Error reading labels file (${labelsPath}):`, error);
    throw new Error("Failed to load labels.");
  }
};
Data.prototype.getShopData = function (lang) {
  if (!["en", "sv"].includes(lang)) lang = "en"; // Default to English
  const labelsPath = `./server/data/shopData-${lang}.json`;
  try {
    const labels = readFileSync(labelsPath, "utf-8");
    return JSON.parse(labels);
  } catch (error) {
    console.error(`Error reading labels file (${labelsPath}):`, error);
    throw new Error("Failed to load labels.");
  }
};

Data.prototype.getWaterData =function() {
  const waterDataPath = './server/data/testData.json';
  try {
    const waterLogData = readFileSync(waterDataPath, 'utf-8');
    return JSON.parse(waterLogData);
  } catch (error) {
    console.error(`Error reading test data file (${waterDataPath}):`, error);
    throw new Error('Failed to load water data.');
  }
}



export { Data };



