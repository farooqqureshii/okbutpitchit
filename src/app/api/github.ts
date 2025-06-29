import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { repoUrl } = await req.json();
  const token = process.env.GITHUB_TOKEN;
  if (!repoUrl || !token) {
    return new Response(JSON.stringify({ error: 'Missing repoUrl or GitHub token' }), { status: 400 });
  }

  try {
    // Parse owner/repo from URL
    const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?|#)/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Invalid GitHub repo URL' }), { status: 400 });
    }
    const [_, owner, repo] = match;
    const headers = { Authorization: `Bearer ${token}`, 'User-Agent': 'okbutpitchit' };
    // Fetch README
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    const readmeJson = await readmeRes.json();
    const readme = readmeJson.content ? Buffer.from(readmeJson.content, 'base64').toString('utf-8') : '';
    // Fetch repo info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    const repoInfo = await repoRes.json();
    // Fetch contributors
    const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`, { headers });
    const contributors = await contribRes.json();
    // Fetch recent commits
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers });
    const commits = await commitsRes.json();
    // Fetch open issues
    const issuesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`, { headers });
    const issues = await issuesRes.json();
    return new Response(
      JSON.stringify({
        readme,
        repoInfo,
        contributors,
        commits,
        issues,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch GitHub data', details: String(e) }), { status: 500 });
  }
} 