# Guide de migration de la base de données

Ce guide vous explique comment configurer et migrer la base de données pour le système de réservation.

## 📋 Prérequis

- Node.js 20.14+ installé
- Une base de données PostgreSQL (ou MySQL/SQLite selon votre choix)
- Les dépendances npm installées

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

Créez un fichier `.env` à la racine du projet (copiez `.env.example`) :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos informations de connexion :

```env
# Pour PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/taxi_db?schema=public"

# Pour SQLite (développement uniquement)
# DATABASE_URL="file:./dev.db"
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

### 4. Créer les migrations

```bash
npx prisma migrate dev --name init
```

Cette commande va :
- Créer les tables dans votre base de données
- Générer les fichiers de migration dans `prisma/migrations/`

### 5. (Optionnel) Visualiser la base de données

```bash
npx prisma studio
```

Cela ouvre une interface graphique pour visualiser et modifier vos données.

## 📊 Structure de la base de données

### Tables créées

1. **clients** - Informations des clients
   - id, firstName, lastName, email, phone
   - Relations avec les réservations

2. **vehicles** - Véhicules disponibles
   - id, name, type, capacity, description, isAvailable

3. **drivers** - Chauffeurs (optionnel)
   - id, firstName, lastName, phone, email, license, isAvailable

4. **reservations** - Réservations
   - Informations complètes de la réservation
   - Relations avec client, vehicle, driver
   - Statut (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)

## 🔄 Commandes utiles

### Créer une nouvelle migration

```bash
npx prisma migrate dev --name nom_de_la_migration
```

### Appliquer les migrations en production

```bash
npx prisma migrate deploy
```

### Réinitialiser la base de données (⚠️ supprime toutes les données)

```bash
npx prisma migrate reset
```

### Générer le client Prisma après modification du schéma

```bash
npx prisma generate
```

## 📝 Seeder (données initiales)

Pour ajouter des données initiales, créez un fichier `prisma/seed.ts` :

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Ajouter des véhicules
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Mercedes V-Class',
        type: 'Van',
        capacity: 7,
        description: 'Véhicule premium pour tous vos déplacements',
        isAvailable: true,
      },
      {
        name: 'Skoda Kodiaq',
        type: 'SUV',
        capacity: 6,
        description: 'SUV moderne pour vos trajets urbains et longue distance',
        isAvailable: true,
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Puis ajoutez dans `package.json` :

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Et exécutez :

```bash
npx prisma db seed
```

## 🔌 API Routes disponibles

### Réservations

- `GET /api/reservations` - Liste toutes les réservations
  - Query params: `?status=PENDING&clientId=xxx&date=2024-01-01`
- `POST /api/reservations` - Créer une réservation
- `GET /api/reservations/[id]` - Récupérer une réservation
- `PATCH /api/reservations/[id]` - Mettre à jour une réservation
- `DELETE /api/reservations/[id]` - Supprimer une réservation

### Véhicules

- `GET /api/vehicles` - Liste tous les véhicules
  - Query params: `?available=true` pour seulement les disponibles

## 🛠️ Exemples d'utilisation

### Créer une réservation via l'API

```typescript
const response = await fetch('/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0123456789',
    serviceType: 'aeroport',
    pickupAddress: '123 Rue de Paris, 75001 Paris',
    dropoffAddress: 'Aéroport Charles de Gaulle',
    pickupDate: '2024-12-31T10:00:00Z',
    pickupTime: '10:00',
    passengers: 2,
    luggage: 2,
    flightNumber: 'AF123',
    notes: 'Vol en retard possible',
  }),
})
```

### Récupérer les réservations en attente

```typescript
const response = await fetch('/api/reservations?status=PENDING')
const { reservations } = await response.json()
```

## 📚 Documentation Prisma

Pour plus d'informations, consultez la [documentation Prisma](https://www.prisma.io/docs).

