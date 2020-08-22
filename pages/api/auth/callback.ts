import {NextApiRequest, NextApiResponse} from 'next';
import config from '../../../lib/config';
import {redirectUri, setAuthCookie, tokenRequest} from "../../../lib/auth";

export default async function callbackApi(req: NextApiRequest, res: NextApiResponse) {
    const code = typeof req.query.code === 'string' ? req.query.code : req.query.code[0];
    console.log('callbackApi: Received code', code);

    const auth = await tokenRequest('authorization_code', {
        redirect_uri: redirectUri(req),
        code
    });

    console.log(`callbackApi: Setting ${config.auth.cookieName} cookie`);
    setAuthCookie(auth, res);
    res.redirect(`${config.auth.useHttps ? 'https' : 'http'}://${req.headers.host}`)
}