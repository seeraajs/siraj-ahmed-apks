import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_OWNER = 'seeraajs';
const GITHUB_REPO = 'siraj-ahmed-apks';
const GITHUB_BRANCH = 'main';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: 'GitHub token is not configured on the server.',
      });
    }

    const { fileName, fileBase64, contentType } = req.body || {};

    if (!fileName || !fileBase64) {
      return res.status(400).json({
        error: 'fileName and fileBase64 are required.',
      });
    }

    const safeFileName = String(fileName)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');

    const path = `public/icons/apps/${safeFileName}`;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'siraj-ahmed-tech',
        },
        body: JSON.stringify({
          message: `Upload app icon: ${safeFileName}`,
          content: fileBase64,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API error:', data);

      return res.status(response.status).json({
        error: data?.message || 'GitHub upload failed.',
      });
    }

    const iconUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

    return res.status(200).json({
      success: true,
      iconUrl,
      path,
      contentType: contentType || 'image/png',
    });
  } catch (error) {
    console.error('Upload icon error:', error);

    return res.status(500).json({
      error: 'Internal server error while uploading icon.',
    });
  }
}