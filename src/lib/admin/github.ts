// github.ts — thin wrapper over the GitHub REST API.
// All functions take a token as the first argument so callers can swap
// tokens or call with stale tokens for testing.

const API = 'https://api.github.com';
export const OWNER = 'moalketbi';
export const REPO = 'odd-server-manager-wiki';
export const BRANCH = 'main';

interface GhUser { login: string; }
interface GhFile { name: string; path: string; sha: string; }
interface GhFileContent { content: string; sha: string; encoding: string; }
interface GhWorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  head_commit: { message: string };
  created_at: string;
  html_url: string;
}

function headers(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function validateToken(token: string): Promise<GhUser | null> {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) return null;
  return res.json();
}

export async function listFilesRecursive(
  token: string,
  pathPrefix: string,
): Promise<string[]> {
  const url = `${API}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to list tree: ${res.status}`);
  const data = await res.json();
  return (data.tree as { path: string; type: string }[])
    .filter((entry) => entry.type === 'blob' && entry.path.startsWith(pathPrefix))
    .map((entry) => entry.path);
}

export async function getFileContent(
  token: string,
  path: string,
): Promise<{ text: string; sha: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = (await res.json()) as GhFileContent;
  // GitHub returns base64 with \n line breaks
  const text = atob(data.content.replace(/\n/g, ''));
  return { text, sha: data.sha };
}

export async function listDirectory(
  token: string,
  path: string,
): Promise<GhFile[]> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(token) });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Failed to list ${path}: ${res.status}`);
  return res.json();
}

export async function putFile(
  token: string,
  path: string,
  base64Content: string,
  message: string,
  sha?: string,
): Promise<{ sha: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const body: Record<string, unknown> = {
    message,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`PUT ${path} failed: ${res.status} ${detail}`);
  }
  const data = await res.json();
  return { sha: data.content.sha };
}

export async function listRecentRuns(token: string): Promise<GhWorkflowRun[]> {
  const url = `${API}/repos/${OWNER}/${REPO}/actions/runs?per_page=5&branch=${BRANCH}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to list runs: ${res.status}`);
  const data = await res.json();
  return data.workflow_runs;
}
