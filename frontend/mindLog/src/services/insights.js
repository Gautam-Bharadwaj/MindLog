import { getEntries } from './storage';

const MOOD_SCORES = {
  'rad': 2, 'good': 1, 'meh': 0, 'bad': -1, 'awful': -2,
};

const calculateFrequencies = (entries) => {
  const moodCounts = {};
  const tagCounts = {};
  let totalScore = 0;
  
  entries.forEach(entry => {
    // 1. Mood Calculation
    const mood = entry.mood;
    if (mood && MOOD_SCORES[mood] !== undefined) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      totalScore += MOOD_SCORES[mood];
    }
    
    // 2. Tag Calculation (Combining Sleep and Social)
    if (entry.sleep) {
      tagCounts[entry.sleep] = (tagCounts[entry.sleep] || 0) + 1;
    }
    if (entry.social) {
      tagCounts[entry.social] = (tagCounts[entry.social] || 0) + 1;
    }
  });
  
  return { moodCounts, tagCounts, totalScore };
};

export const getInsights = async (days = 7) => { 
  const findMostCommon = (counts) => {
    return Object.entries(counts).reduce(
      (acc, [key, value]) => (value > acc.count ? { name: key, count: value } : acc),
      { name: 'N/A', count: 0 } 
    );
  };

  const allEntries = await getEntries();
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // 3. Fix: Use 'entry.date' instead of 'timestamp'
  const recentEntries = allEntries.filter(entry => {
    return new Date(entry.date) >= cutoffDate;
  });
  
  if (recentEntries.length === 0) {
    return {
      mostCommonMood: { name: 'N/A', count: 0 },
      mostCommonTag: { name: 'N/A', count: 0 },
      summaryMessage: `No entries in the last ${days} days. Start logging your mood!`,
      moodTrendData: [],
      timePeriod: days, // Ensure this is returned
    };
  }

  const { moodCounts, tagCounts, totalScore } = calculateFrequencies(recentEntries);
  const averageScore = totalScore / recentEntries.length;
  
  const mostCommonMood = findMostCommon(moodCounts);
  const mostCommonTag = findMostCommon(tagCounts);

  let summaryMessage = "";
  const mostMood = mostCommonMood.name.toUpperCase();
  const mostTag = mostCommonTag.name;

  if (averageScore >= 1.5) {
    summaryMessage = `Fantastic streak! Your most common mood was ${mostMood}. Focusing on ${mostTag} is paying off!`;
  } else if (averageScore >= 0.5) {
    summaryMessage = `Things are looking up! Average mood is positive. ${mostTag} was your top activity.`;
  } else if (averageScore <= -1.0) {
    summaryMessage = mostTag !== 'N/A' 
      ? `Tough time lately. Top tag: "${mostTag}". Reflect on how this impacts you.`
      : `You've faced challenges. Be kind to yourself.`;
  } else {
    summaryMessage = `Stable mood centered around ${mostMood}. Top activity: "${mostTag}".`;
  }
  
  // 4. Fix: Map 'date' correctly for the trend graph
  const moodTrendData = recentEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    moodValue: MOOD_SCORES[entry.mood] || 0,
    moodName: entry.mood,
  }));
  
  return {
    timePeriod: days,
    mostCommonMood,
    mostCommonTag,
    summaryMessage,
    moodTrendData,
  };
};