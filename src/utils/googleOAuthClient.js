import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS_GOOGLE } from '../constants/index.js';
import createHttpError from 'http-errors';

const client = new OAuth2Client(
  getEnvVar(ENV_VARS_GOOGLE.GOOGLE_OAUTH_CLIENT_ID),
  getEnvVar(ENV_VARS_GOOGLE.GOOGLE_OAUTH_CLIENT_SECRET),
  getEnvVar(ENV_VARS_GOOGLE.GOOGLE_OAUTH_REDIRECT_URI)
);

export const getGoogleOAuthLink = () => {
  return client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    access_type: 'offline',
    prompt: 'consent',
  });
};

export const getAuthData = (code) => {
  try {
    const {tokens} = await client.getToken(code);

    const idToken = tokens.id_token;
  
    if (!idToken) {
      throw createHttpError(401, 'IdToken not found!');
      const userData = await client.verifyIdToken({
        id_Token: idToken,
      });
      return userData.getPayload()
    }

  } catch (err) {
    console.error(err);
    throw createHttpError(401, 'Failed to authorized  user with Google OAuth ')
  }
  
};