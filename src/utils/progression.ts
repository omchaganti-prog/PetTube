export const LEVEL_XP_STEP = 180;
export const ACHIEVEMENT_MILESTONES = [5, 15, 35, 60, 100, 150, 200] as const;

function dateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function hasDiscoveryOnDay(discoveredDays: Set<string>, day: Date) {
  return discoveredDays.has(day.toISOString().slice(0, 10));
}

export function getCurrentStreak(discovered: Record<string, number>) {
  const discoveredDays = new Set(Object.values(discovered).map(dateKey));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const cursor = new Date(today);
  while (hasDiscoveryOnDay(discoveredDays, cursor)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getLongestStreak(discovered: Record<string, number>) {
  const discoveredDays = Array.from(new Set(Object.values(discovered).map(dateKey))).sort();
  if (discoveredDays.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < discoveredDays.length; i += 1) {
    const prev = new Date(discoveredDays[i - 1]);
    const curr = new Date(discoveredDays[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
    if (diff === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getDiscoveryXP(discoveredCount: number, currentStreak: number) {
  return discoveredCount * 25 + currentStreak * 20;
}

export function getLevelInfo(xp: number) {
  const level = Math.max(1, Math.floor(xp / LEVEL_XP_STEP) + 1);
  const levelStart = (level - 1) * LEVEL_XP_STEP;
  const xpInLevel = xp - levelStart;
  return {
    level,
    xpInLevel,
    xpNeededForNextLevel: LEVEL_XP_STEP,
    progressPct: Math.round((xpInLevel / LEVEL_XP_STEP) * 100),
  };
}

export function getAchievementsUnlocked(discoveredCount: number) {
  return ACHIEVEMENT_MILESTONES.filter((goal) => discoveredCount >= goal).length;
}

export function getAchievementNextGoal(discoveredCount: number) {
  return ACHIEVEMENT_MILESTONES.find((goal) => goal > discoveredCount) ?? null;
}
