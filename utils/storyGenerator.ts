import { GitHubCommit, StoryEvent, StoryType, ImpactLevel } from '../types';

/**
 * Analyzes a commit message to determine the type of change.
 */
const determineType = (message: string): StoryType => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.startsWith('merge')) return StoryType.MERGE;
  if (lowerMsg.includes('feat') || lowerMsg.includes('add') || lowerMsg.includes('implement') || lowerMsg.includes('new')) return StoryType.FEATURE;
  if (lowerMsg.includes('fix') || lowerMsg.includes('bug') || lowerMsg.includes('patch') || lowerMsg.includes('resolve') || lowerMsg.includes('correct')) return StoryType.FIX;
  if (lowerMsg.includes('refactor') || lowerMsg.includes('clean') || lowerMsg.includes('optimize') || lowerMsg.includes('structure')) return StoryType.REFACTOR;
  if (lowerMsg.includes('docs') || lowerMsg.includes('readme') || lowerMsg.includes('guide')) return StoryType.DOCS;
  if (lowerMsg.includes('config') || lowerMsg.includes('chore') || lowerMsg.includes('ci') || lowerMsg.includes('build') || lowerMsg.includes('depend')) return StoryType.CONFIG;
  
  return StoryType.UNKNOWN;
};

/**
 * Calculates impact level based on message length and type.
 */
const calculateImpact = (type: StoryType, message: string): ImpactLevel => {
  const length = message.length;
  
  if (type === StoryType.MERGE) return 'Critical';
  if (type === StoryType.FEATURE && length > 100) return 'High';
  if (type === StoryType.FIX && length > 150) return 'High';
  if (type === StoryType.REFACTOR && length > 200) return 'Critical';
  if (length > 300) return 'Critical';
  if (length > 50) return 'Medium';
  
  return 'Low';
};

/**
 * Generates a fun "XP" amount based on impact.
 */
const calculateXP = (impact: ImpactLevel): number => {
  switch (impact) {
    case 'Critical': return Math.floor(Math.random() * 500) + 500;
    case 'High': return Math.floor(Math.random() * 300) + 200;
    case 'Medium': return Math.floor(Math.random() * 100) + 100;
    default: return Math.floor(Math.random() * 50) + 10;
  }
};

/**
 * Generates an RPG-style title for the repository based on stars and activity.
 */
export const generateRepoTitle = (stars: number, forks: number): string => {
  const score = stars + (forks * 2);
  
  if (score > 100000) return "Celestial Artifact";
  if (score > 50000) return "Kingdom Vault";
  if (score > 20000) return "Grand Archive";
  if (score > 10000) return "Masterwork Engine";
  if (score > 5000) return "Forged Citadel";
  if (score > 1000) return "Bustling Guildhall";
  if (score > 500) return "Village Library";
  if (score > 100) return "Promising Scroll";
  return "Hidden Manuscript";
};

/**
 * Generates a title for a specific commit event based on XP.
 */
export const generateEventRank = (exp: number): string => {
  if (exp > 800) return "Mythic Feat";
  if (exp > 500) return "Legendary Act";
  if (exp > 300) return "Epic Deed";
  if (exp > 150) return "Heroic Effort";
  return "Common Task";
};

/**
 * Generates a human-readable narrative sentence based on the commit.
 */
const generateNarrative = (type: StoryType, message: string, author: string, impact: ImpactLevel): string => {
  const firstLine = message.split('\n')[0];
  const cleanSubject = firstLine.replace(/^(feat|fix|docs|chore|refactor|style|test|merge)(\(.*\))?:/, '').trim();
  
  // Choose narrative style based on impact
  const intense = impact === 'High' || impact === 'Critical';

  switch (type) {
    case StoryType.FEATURE:
      return intense 
        ? `${author} forged a major capability: "${cleanSubject}". The codebase grows stronger.`
        : `${author} added a new skill to the project: "${cleanSubject}".`;
    case StoryType.FIX:
      return intense
        ? `${author} vanquished a critical bug identified as "${cleanSubject}". Peace is restored.`
        : `${author} patched a glitch: "${cleanSubject}".`;
    case StoryType.REFACTOR:
      return intense
        ? `${author} performed a grand restructuring: "${cleanSubject}". The architecture shifts.`
        : `${author} tidied up the code: "${cleanSubject}".`;
    case StoryType.DOCS:
      return `${author} inscribed new knowledge about "${cleanSubject}" into the archives.`;
    case StoryType.CONFIG:
      return `${author} tuned the engine components: "${cleanSubject}".`;
    case StoryType.MERGE:
      return `${author} united timeline branches, merging separate realities into one.`;
    default:
      return `${author} logged an event: "${cleanSubject}".`;
  }
};

/**
 * Transforms a GitHub API commit object into a StoryEvent.
 */
export const transformCommitToStory = (commit: GitHubCommit): StoryEvent => {
  const { author, commit: commitData, sha, html_url } = commit;
  const message = commitData.message;
  const authorName = author ? author.login : commitData.author.name;
  const authorAvatar = author ? author.avatar_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;
  
  const type = determineType(message);
  const impact = calculateImpact(type, message);
  const narrative = generateNarrative(type, message, authorName, impact);
  const isMajor = impact === 'High' || impact === 'Critical';

  // Extract a clean title (first line, max 60 chars)
  let title = message.split('\n')[0];
  if (title.length > 60) title = title.substring(0, 57) + '...';

  return {
    id: sha,
    date: new Date(commitData.author.date),
    authorName,
    authorAvatar,
    title,
    narrative,
    type,
    rawMessage: message,
    url: html_url,
    isMajor,
    impact,
    stats: {
      exp: calculateXP(impact),
      mana: Math.floor(Math.random() * 50)
    }
  };
};