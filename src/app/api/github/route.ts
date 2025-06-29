import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    const token = process.env.GITHUB_TOKEN;
    
    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Please provide a GitHub repository URL' }, 
        { status: 400 }
      );
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub API token not configured. Please add GITHUB_TOKEN to your .env file.' }, 
        { status: 500 }
      );
    }

    // Parse owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL. Please use format: https://github.com/owner/repo' }, 
        { status: 400 }
      );
    }
    
    const [, owner, repo] = match;
    const headers = { 
      Authorization: `Bearer ${token}`, 
      'User-Agent': 'okbutpitchit',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Fetch all data in parallel for better performance
    const [readmeRes, repoRes, contribRes, commitsRes, issuesRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`, { headers })
    ]);

    // Check if main repo exists
    if (repoRes.status === 'rejected' || (repoRes.status === 'fulfilled' && !repoRes.value.ok)) {
      if (repoRes.status === 'fulfilled' && repoRes.value.status === 404) {
        return NextResponse.json(
          { error: 'Repository not found. Please check the URL and make sure the repository is public.' }, 
          { status: 404 }
        );
      }
      if (repoRes.status === 'fulfilled' && repoRes.value.status === 403) {
        return NextResponse.json(
          { error: 'Access denied. The repository might be private or your GitHub token has insufficient permissions.' }, 
          { status: 403 }
        );
      }
      throw new Error('Failed to fetch repository information');
    }

    const repoInfo = await repoRes.value.json();

    // Handle README (optional)
    let readme = '';
    if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
      try {
        const readmeJson = await readmeRes.value.json();
        readme = readmeJson.content ? Buffer.from(readmeJson.content, 'base64').toString('utf-8') : '';
      } catch (e) {
        console.warn('Failed to parse README:', e);
      }
    }

    // Handle contributors (optional)
    let contributors = [];
    if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
      try {
        contributors = await contribRes.value.json();
      } catch (e) {
        console.warn('Failed to fetch contributors:', e);
      }
    }

    // Handle commits (optional)
    let commits = [];
    if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
      try {
        commits = await commitsRes.value.json();
      } catch (e) {
        console.warn('Failed to fetch commits:', e);
      }
    }

    // Handle issues (optional)
    let issues = [];
    if (issuesRes.status === 'fulfilled' && issuesRes.value.ok) {
      try {
        issues = await issuesRes.value.json();
      } catch (e) {
        console.warn('Failed to fetch issues:', e);
      }
    }

    return NextResponse.json({
      readme,
      repoInfo,
      contributors,
      commits,
      issues,
    });

  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository data. Please check your internet connection and try again.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
} 