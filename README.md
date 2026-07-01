# Carte d'anniversaire — Awa Ndiaye 👑

Page web statique protégée par mot de passe : confettis, musique, timeline de souvenirs et bêtisier vidéo.

## Authentification

Le site est protégé par un **mot de passe unique**. Sur Vercel, configure ces variables d'environnement :

| Variable | Description |
|----------|-------------|
| `SITE_PASSWORD` | Le mot de passe que tu choisis (seul toi le connais) |
| `AUTH_TOKEN` | Token aléatoire pour la session (génère-le une fois) |

Générer le token :

```bash
openssl rand -hex 32
```

Sur Vercel : **Project → Settings → Environment Variables** → ajoute les deux variables → **Redeploy**.

Sans ces variables, la page de login affichera une erreur serveur.

## Personnalisation

Édite [`js/config.js`](js/config.js) pour les textes, photos et vidéos.

## Déploiement Vercel

1. Push sur GitHub ou glisse-dépose le dossier sur [vercel.com/new](https://vercel.com/new)
2. Ajoute `SITE_PASSWORD` et `AUTH_TOKEN` dans les variables d'environnement
3. Redéploie

Le mot de passe **n'est jamais dans le code** — uniquement dans les variables Vercel.

## Prévisualisation locale

L'authentification ne fonctionne qu'avec Vercel (middleware + API) :

```bash
npx vercel dev
```

Puis configure un fichier `.env.local` (copie de `.env.example`).
