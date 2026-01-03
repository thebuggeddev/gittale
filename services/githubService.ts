import { GITHUB_API_BASE } from '../constants';
import { GitHubCommit, RepoInfo, Contributor, Languages } from '../types';

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  rateLimitRemaining?: number;
}

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('gittale_token');
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response, errorMsg: string): Promise<FetchResult<T>> => {
    if (response.status === 404) {
      return { data: null, error: 'Not found.' };
    }
    
    if (response.status === 403) {
      // Check if it's actually rate limit
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
         return { data: null, error: 'RATE_LIMIT_EXCEEDED' };
      }
      return { data: null, error: 'Access forbidden (403). Only public repositories are supported.' };
    }

    if (response.status === 401) {
       return { data: null, error: 'Invalid Access Token. Please check your settings.' };
    }

    if (!response.ok) {
      return { data: null, error: errorMsg };
    }

    const data = await response.json();
    return { data, error: null };
};

export const fetchRepoDetails = async (repoIdentifier: string): Promise<FetchResult<RepoInfo>> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repoIdentifier}`, { headers: getHeaders() });
    if (response.status === 404) return { data: null, error: 'Repository not found. Check spelling.' };
    return handleResponse(response, `Error: ${response.statusText}`);
  } catch (err) {
    return { data: null, error: 'Network error.' };
  }
};

export const fetchCommits = async (repoIdentifier: string): Promise<FetchResult<GitHubCommit[]>> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repoIdentifier}/commits?per_page=30`, { headers: getHeaders() });
    return handleResponse(response, 'Failed to fetch commits.');
  } catch (err) {
    return { data: null, error: 'Network error fetching commits.' };
  }
};

export const fetchContributors = async (repoIdentifier: string): Promise<FetchResult<Contributor[]>> => {
  try {
    // Fetch top 30 contributors
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repoIdentifier}/contributors?per_page=30`, { headers: getHeaders() });
    return handleResponse(response, 'Failed to fetch contributors.');
  } catch (err) {
    return { data: null, error: 'Network error fetching contributors.' };
  }
};

export const fetchLanguages = async (repoIdentifier: string): Promise<FetchResult<Languages>> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repoIdentifier}/languages`, { headers: getHeaders() });
    return handleResponse(response, 'Failed to fetch languages.');
  } catch (err) {
    return { data: null, error: 'Network error fetching languages.' };
  }
};