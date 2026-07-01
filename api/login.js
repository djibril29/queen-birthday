export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const sitePassword = process.env.SITE_PASSWORD;
  const authToken = process.env.AUTH_TOKEN;

  if (!sitePassword || !authToken) {
    return res.status(500).json({ error: "Configuration serveur manquante" });
  }

  const { password } = req.body || {};

  if (password !== sitePassword) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const secure = process.env.VERCEL === "1" ? " Secure;" : "";
  res.setHeader(
    "Set-Cookie",
    `auth=${authToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict;${secure}`
  );

  return res.status(200).json({ ok: true });
}
