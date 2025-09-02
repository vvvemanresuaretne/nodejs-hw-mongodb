import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar';
import { ENV_VARS_GOOGLE} from '../constants/index.js'

const client = new OAuth2Client({
    projectId: getEnvVar(ENV_VARS.GOOGLE_OAUTH_PROJECT_ID),
    clientId: getEnvVar(ENV_VARS.GOOGLE_OAUTH_CLIENT_ID),
    client_secret: getEnvVar(ENV_VARS.GOOGLE_OAUTH_CLIENT_SECRET),
    redirectUri: getEnvVar(ENV_VARS.GOOGLE_OAUTH_REDIRECT_URI),
})

export const getGoogleOAuthLink = () => client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
    access_type: 'offline',
});