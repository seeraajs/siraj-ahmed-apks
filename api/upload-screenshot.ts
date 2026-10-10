import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authorizeAdmin } from '../lib/server/authorizeAdmin';

const GITHUB_OWNER = 'seeraajs';
const GITHUB_REPO = 'siraj-ahmed-apks';
const GITHUB_BRANCH = 'main';

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the Firebase administrator before accessing GitHub credentials.
  if (!(await authorizeAdmin(req, res))) {
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: 'GitHub token is not configured on the server.',
      });
    }

    const { fileName, fileBase64, contentType, fileSize } = req.body || {};

    if (
      typeof fileName !== 'string' ||
      typeof fileBase64 !== 'string' ||
      !fileName.trim() ||
      !fileBase64
    ) {
      return res.status(400).json({
        error: 'fileName and fileBase64 are required.',
      });
    }

    if (fileName.length > 180) {
      return res.status(400).json({ error: 'Screenshot filename is too long.' });
    }

    if (typeof contentType !== 'string' || !ALLOWED_TYPES.has(contentType)) {
      return res.status(400).json({
        error: 'Only PNG, JPEG, and WebP screenshots are supported.',
      });
    }

    if (
      fileSize === undefined ||
      !Number.isFinite(Number(fileSize)) ||
      Number(fileSize) <= 0 ||
      Number(fileSize) > MAX_FILE_SIZE_BYTES
    ) {
      return res.status(400).json({
        error: 'Screenshot must be larger than 0 bytes and no larger than 3 MB.',
      });
    }

    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(fileBase64)) {
      return res.status(400).json({ error: 'Invalid Base64 screenshot data.' });
    }

    const decodedSize = Buffer.from(fileBase64, 'base64').length;

    if (decodedSize <= 0 || decodedSize > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({ error: 'Screenshot data exceeds the allowed size.' });
    }

    if (Number(fileSize) !== decodedSize) {
      return res.status(400).json({ error: 'Screenshot size validation failed.' });
    }

    const safeFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');

    if (
      safeFileName.length > 120 ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpe?g|webp)$/i.test(safeFileName)
    ) {
      return res.status(400).json({ error: 'Invalid screenshot filename.' });
    }

    const path = `public/screenshots/apps/${safeFileName}`;

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
          message: `Upload app screenshot: ${safeFileName}`,
          content: fileBase64,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub screenshot upload failed with status:', response.status);
      return res.status(response.status).json({
        error: data?.message || 'GitHub screenshot upload failed.',
      });
    }

    const screenshotUrl =
      `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

    return res.status(200).json({
      success: true,
      screenshotUrl,
      path,
      contentType,
    });
  } catch (error) {
    console.error(
      'Upload screenshot error:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return res.status(500).json({
      error: 'Internal server error while uploading screenshot.',
    });
  }
}