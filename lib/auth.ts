import {NextApiRequest, NextApiResponse} from "next";
import cookie from "cookie";
import config from "./config";
import fetch from "node-fetch";

export async function getAuth(req: NextApiRequest): Promise<AuthData | null> {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const data = cookies[config.auth.cookieName];

    if (data === undefined) {
        return null;
    }

    const auth: AuthData = JSON.parse(data);
    return refreshToken(auth);
}

export interface AuthData {
    access_token: string;
    refresh_token: string;
}

export async function tokenRequest(grantType: string, params: any): Promise<AuthData> {
    const request = new URLSearchParams({
        grant_type: grantType,
        client_id: config.auth.clientId,
        client_secret: config.auth.clientSecret,
        ...params
    });

    console.log('tokenRequest: ', grantType, params);

    const response = await fetch(`https://api.monzo.com/oauth2/token`, {
        method: 'POST',
        body: request
    });

    console.log(`tokenRequest: Received ${response.status} response`);

    if (response.status !== 200) {
        const body = await response.text();
        throw new Error(`Got ${response.status} response from Monzo: ${body}`)
    }

    return response.json();
}

export async function refreshToken(auth: AuthData): Promise<AuthData> {
    return tokenRequest('refresh_token', {
        refresh_token: auth.refresh_token
    })
}

export function redirectUri(req: NextApiRequest): string {
    return `${config.auth.useHttps ? 'https' : 'http'}://${req.headers.host}${config.auth.redirectUri}`
}

export function setAuthCookie(auth: AuthData, res: NextApiResponse) {
    res.setHeader('Set-Cookie', cookie.serialize(config.auth.cookieName, JSON.stringify(auth), {
        path: '/'
    }));
}