# 🚀 Guide de migration rapide - Système de réservation

## Étape 1 : Configuration de la base de données

### Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec votre URL de base de données :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taxi_db?schema=public"
```

**Options de base de données :**

- **PostgreSQL** (recommandé pour la production) :
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/taxi_db?schema=public"
  ```

- **SQLite** (pour le développement local) :
  ```env
  DATABASE_URL="file:./dev.db"
  ```

- **MySQL** :
  ```env
  DATABASE_URL="mysql://user:password@localhost:3306/taxi_db"
  ```

## Étape 2 : Générer le client Prisma

```bash
npm run db:generate
```

## Étape 3 : Créer les migrations

```bash
npm run db:migrate
```

Cette commande va :
- Créer le dossier `prisma/migrations/`
- Créer toutes les tables dans votre base de données
- Vous demander un nom pour la migration (ex: "init")

## Étape 4 : (Optionnel) Ajouter des données initiales

```bash
npm run db:seed
```

Cela ajoute :
- 2 véhicules (Mercedes V-Class, Skoda Kodiaq)
- 2 chauffeurs d'exemple

## Étape 5 : Vérifier que tout fonctionne

### Ouvrir Prisma Studio (interface graphique)

```bash
npm run db:studio
```

Cela ouvre une interface web sur `http://localhost:5555` pour visualiser vos données.

## ✅ Vérification

Votre base de données est maintenant prête ! Vous pouvez :

1. **Créer une réservation** via l'API :
   ```bash
   POST /api/reservations
   ```

2. **Récupérer les réservations** :
   ```bash
   GET /api/reservations
   GET /api/reservations?status=PENDING
   ```

3. **Récupérer les véhicules** :
   ```bash
   GET /api/vehicles
   GET /api/vehicles?available=true
   ```

## 📋 Structure des tables créées

- **clients** : Informations des clients
- **vehicles** : Véhicules disponibles
- **drivers** : Chauffeurs (optionnel)
- **reservations** : Toutes les réservations

## 🔄 Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:migrate` | Crée/applique les migrations |
| `npm run db:studio` | Ouvre l'interface graphique |
| `npm run db:push` | Pousse le schéma sans migration |
| `npm run db:seed` | Ajoute les données initiales |

## 🆘 Problèmes courants

### Erreur : "Can't reach database server"

➡️ Vérifiez que votre base de données est démarrée et que l'URL dans `.env` est correcte.

### Erreur : "Migration failed"

➡️ Supprimez le dossier `prisma/migrations` et relancez `npm run db:migrate`.

### Erreur : "Prisma Client not generated"

➡️ Exécutez `npm run db:generate`.

## 📚 Documentation complète

Consultez `README-DATABASE.md` pour plus de détails.

