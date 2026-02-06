# Dossier Public - Fichiers statiques

Ce dossier contient tous les fichiers statiques accessibles directement via l'URL du site.

## 📁 Structure des dossiers

```
public/
├── images/
│   ├── vehicles/     # Photos des véhicules (Mercedes, Skoda, etc.)
│   ├── logo/         # Logo et identité visuelle
│   ├── gallery/      # Galerie photos (photos de flotte, équipe, etc.)
│   └── hero/         # Images pour la section hero
├── videos/           # Vidéos (présentation, témoignages, etc.)
└── documents/        # Documents PDF (tarifs, CGV, etc.)
```

## 📝 Comment utiliser les fichiers

### Images

Placez vos images dans les dossiers appropriés, puis référencez-les dans votre code avec un chemin commençant par `/` :

```tsx
// Exemple : public/images/vehicles/mercedes.jpg
<Image src="/images/vehicles/mercedes.jpg" alt="Mercedes" width={400} height={250} />
```

### Vidéos

```tsx
// Exemple : public/videos/presentation.mp4
<video src="/videos/presentation.mp4" controls />
```

### Documents

```tsx
// Exemple : public/documents/tarifs.pdf
<a href="/documents/tarifs.pdf" download>Télécharger les tarifs</a>
```

## ✅ Formats recommandés

- **Images** : JPG, PNG, WebP
- **Vidéos** : MP4, WebM
- **Documents** : PDF

## 💡 Astuce

Utilisez le composant `Image` de Next.js pour les images afin de bénéficier de l'optimisation automatique :
```tsx
import Image from 'next/image'
```

## 📸 Guide détaillé des images

Pour savoir exactement quelles images mettre et où, consultez le guide complet :
👉 **[GUIDE_IMAGES.md](./images/GUIDE_IMAGES.md)**

