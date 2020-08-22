import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import config from "./config";
import fetch, { Response } from "node-fetch";
import { AuthData } from "./monzo";

export async function getAuth(req: NextApiRequest): Promise<AuthData | null> {
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const data = cookies[config.auth.cookieName];

  if (data === undefined) {
    return null;
  }

  const auth: AuthData = JSON.parse(data);
  return refreshToken(auth);
}

export class TokenError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export async function tokenRequest(
  grantType: string,
  params: any
): Promise<AuthData> {
  const request = new URLSearchParams({
    grant_type: grantType,
    client_id: config.auth.clientId,
    client_secret: config.auth.clientSecret,
    ...params,
  });

  console.log(`tokenRequest: grant_type=${grantType}`, params);

  const response = await fetch(`https://api.monzo.com/oauth2/token`, {
    method: "POST",
    body: request,
  });

  console.log(`tokenRequest: Received ${response.status} response`);

  if (response.status !== 200) {
    throw new TokenError(
      `Got ${response.status} response from Monzo`,
      response
    );
  }

  return response.json();
}

export async function refreshToken(auth: AuthData): Promise<AuthData> {
  return tokenRequest("refresh_token", {
    refresh_token: auth.refresh_token,
  });
}

export function redirectUri(req: NextApiRequest): string {
  return `${config.auth.useHttps ? "https" : "http"}://${req.headers.host}${
    config.auth.redirectUri
  }`;
}

export function setAuthCookie(auth: AuthData, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(config.auth.cookieName, JSON.stringify(auth), {
      path: "/",
    })
  );
}
