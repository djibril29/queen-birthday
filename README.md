# Carte d'anniversaire — Awa Ndiaye 👑

Page web statique : confettis, musique, message personnalisé, timeline de souvenirs et bêtisier vidéo.

## Personnalisation

Éditez uniquement [`js/config.js`](js/config.js) :

```javascript
const BIRTHDAY_CONFIG = {
  name: "Awa Ndiaye",
  nickname: "Ma reine",
  timeline: [
    {
      date: "31 mai 2026",
      src: "assets/gallery/photo.jpg",
      text: "Le petit texte à côté de la photo"
    }
  ],
  bloopers: [
    {
      src: "assets/bloopers/video1.mp4",
      title: "Titre de la bêtise",
      text: "Description optionnelle"
    }
  ]
};
```

### Fichiers média

- **Photos** — `assets/gallery/`
- **Vidéos bêtisier** — `assets/bloopers/` (MP4)
- **Musique** — `assets/music.mp3`

## Prévisualisation locale

```bash
cd queen-birthday
python3 -m http.server 8080
```

Puis visitez http://localhost:8080

## Déploiement

- **Vercel** : glissez-déposez le dossier sur [vercel.com/new](https://vercel.com/new)
- **Netlify Drop** : [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** : poussez le repo et activez Pages sur la branche `main`
# queen-birthday
