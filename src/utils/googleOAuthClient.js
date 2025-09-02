import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS_GOOGLE } from '../constants/index.js';

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
