import { StoryType } from './types';

export const GITHUB_API_BASE = 'https://api.github.com';

export const TYPE_COLORS: Record<StoryType, string> = {
  [StoryType.FEATURE]: 'bg-blue-400 dark:bg-blue-500',
  [StoryType.FIX]: 'bg-orange-400 dark:bg-orange-500',
  [StoryType.REFACTOR]: 'bg-purple-400 dark:bg-purple-500',
  [StoryType.DOCS]: 'bg-yellow-300 dark:bg-yellow-400',
  [StoryType.CONFIG]: 'bg-slate-400 dark:bg-slate-500',
  [StoryType.MERGE]: 'bg-pink-400 dark:bg-pink-500',
  [StoryType.UNKNOWN]: 'bg-white dark:bg-gray-200',
};

export const TYPE_ICONS: Record<StoryType, string> = {
  [StoryType.FEATURE]: '✨',
  [StoryType.FIX]: '🐛',
  [StoryType.REFACTOR]: '🔧',
  [StoryType.DOCS]: '📚',
  [StoryType.CONFIG]: '⚙️',
  [StoryType.MERGE]: '🔀',
  [StoryType.UNKNOWN]: '📝',
};

export const RARITY_BORDERS = {
  Low: 'border-black dark:border-neutral-400',
  Medium: 'border-blue-500 dark:border-blue-400',
  High: 'border-purple-600 dark:border-purple-400',
  Critical: 'border-red-600 dark:border-red-500',
};