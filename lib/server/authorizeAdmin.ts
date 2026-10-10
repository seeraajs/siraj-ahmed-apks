import type { VercelRequest, VercelResponse } from '@vercel/node';

const AUTHORIZED_ADMIN_EMAILS = new Set([
  'seeraajs1@gmail.com',
  'seeraajs@gmail.com',
]);

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
    email?: string;
  }>;
};

type FirebaseTokenClaims = {
  aud?: string;
  iss?: string;
};

export async function authorizeAdmin(
  req: VercelRequest,
  res: VercelResponse
): Promise<boolean> {
  const authorization = req.headers.authorization;
  const match =
    typeof authorization === 'string'
      ? authorization.match(/^Bearer\s+(.+)$/i)
      : null;

  if (!match?.[1]?.trim()) {
    res.status(401).json({
      error: 'Administrator authentication is required.',
    });
    return false;
  }

  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    console.error('Firebase server-side token validation is not configured.');
    res.status(503).json({
      error: 'Administrator authentication is temporarily unavailable.',
    });
    return false;
  }

  const token = match[1].trim();
  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    res.status(401).json({
      error: 'A valid Firebase administrator session is required.',
    });
    return false;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      if (response.status >= 500) {
        console.error(
          'Firebase token validation service returned:',
          response.status
        );
        res.status(503).json({
          error: 'Administrator authentication is temporarily unavailable.',
        });
        return false;
      }

      res.status(401).json({
        error: 'Your administrator session is invalid or expired. Please sign in again.',
      });
      return false;
    }

    const result = (await response.json()) as FirebaseLookupResponse;
    const firebaseUser = result.users?.[0];

    if (!firebaseUser?.localId || !firebaseUser.email) {
      res.status(401).json({
        error: 'A valid Firebase administrator session is required.',
      });
      return false;
    }

    // Inspect project claims only after Firebase has validated the ID token.
    let claims: FirebaseTokenClaims;
    try {
      claims = JSON.parse(
        Buffer.from(tokenParts[1], 'base64url').toString('utf8')
      ) as FirebaseTokenClaims;
    } catch {
      res.status(401).json({
        error: 'A valid Firebase administrator session is required.',
      });
      return false;
    }

    if (
      claims.aud !== projectId ||
      claims.iss !== `https://securetoken.google.com/${projectId}`
    ) {
      res.status(401).json({
        error: 'The administrator session belongs to an unexpected Firebase project.',
      });
      return false;
    }

    const verifiedEmail = firebaseUser.email.trim().toLowerCase();

    if (!AUTHORIZED_ADMIN_EMAILS.has(verifiedEmail)) {
      res.status(403).json({
        error: 'This account is not authorized to upload app assets.',
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      'Firebase administrator token validation failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    res.status(503).json({
      error: 'Administrator authentication is temporarily unavailable.',
    });
    return false;
  }
}