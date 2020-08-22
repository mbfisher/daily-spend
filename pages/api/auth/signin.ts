import { NextApiRequest, NextApiResponse } from 'next';
import config from '../../../lib/config';

export default function signinApi(req: NextApiRequest, res: NextApiResponse) {
    const redirectUri = `${config.auth.useHttps ? 'https' : 'http'}://${req.headers.host}${config.auth.redirectUri}`;
    console.log('signinApi: Redirecting to auth.monzo.com');
    res.redirect(`https://auth.monzo.com/?response_type=code&client_id=${config.auth.clientId}&redirect_uri=${redirectUri}`)
}