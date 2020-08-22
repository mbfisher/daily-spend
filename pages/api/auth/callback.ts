import { NextApiRequest, NextApiResponse } from "next";
import config from "../../../lib/config";
import {
  redirectUri,
  setAuthCookie,
  TokenError,
  tokenRequest,
} from "../../../lib/auth";
import { AuthData } from "../../../lib/monzo";
import { DateTime } from "luxon";

export default async function callbackApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code =
    typeof req.query.code === "string" ? req.query.code : req.query.code[0];
  console.log("callbackApi: Exchanging code", code);

  let auth: AuthData;
  try {
    auth = await tokenRequest("authorization_code", {
      redirect_uri: redirectUri(req),
      code,
    });
  } catch (error) {
    if (error instanceof TokenError) {
      const response = await error.response.json();
      console.error("callbackApi: TokenError", response);
      return res.status(error.response.status).json(response);
    }

    console.error("callbackApi:", error);
    return res.status(500).json({ message: error.message });
  }

  auth.expires_at = DateTime.utc().toSeconds() + auth.expires_in;

  console.log(`callbackApi: Setting ${config.auth.cookieName} cookie`);
  setAuthCookie(auth, res);
  res.redirect(
    `${config.auth.useHttps ? "https" : "http"}://${req.headers.host}/confirm`
  );
}
