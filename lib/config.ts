const config = {
  auth: {
    clientId: process.env.MONZO_CLIENT_ID,
    clientSecret: process.env.MONZO_CLIENT_SECRET,
    useHttps: Object.keys(process.env).includes("MONZO_USE_HTTPS"),
    redirectUri: "/api/auth/callback",
    cookieName: "auth",
  },
  accountId: process.env.MONZO_ACCOUNT_ID,
};

export default config;
