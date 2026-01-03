// GitHub API Types

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface CommitDetail {
  author: CommitAuthor;
  message: string;
  comment_count: number;
}

export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: CommitDetail;
  author: GitHubUser | null;
  html_url: string;
  parents: { sha: string }[];
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface Languages {
  [key: string]: number;
}

// Story / Application Types

export enum StoryType {
  FEATURE = 'Feature',
  FIX = 'Bug Fix',
  REFACTOR = 'Refactor',
  DOCS = 'Documentation',
  CONFIG = 'Configuration',
  MERGE = 'Merge',
  UNKNOWN = 'Update'
}

export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface StoryEvent {
  id: string;
  date: Date;
  authorName: string;
  authorAvatar: string;
  title: string;
  narrative: string; // The "story" explanation
  type: StoryType;
  rawMessage: string;
  url: string;
  isMajor: boolean; // For highlighting important commits
  impact: ImpactLevel; // "Card Rarity"
  stats: {
    exp: number; // Fun "XP" gained from this commit
    mana: number; // Fun "Mana" cost
  };
}

export interface RepoInfo {
  id: number;
  full_name: string;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  open_issues_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  subscribers_count: number;
}