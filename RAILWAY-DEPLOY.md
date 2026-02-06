# Guide de déploiement sur Railway

Ce guide vous explique comment déployer votre application Taxi Website sur Railway.

## Prérequis

- Un compte Railway (https://railway.app)
- Un compte GitHub avec votre dépôt `taxi-website`

## Étapes de déploiement

### 1. Créer un nouveau projet sur Railway

1. Connectez-vous à [Railway](https://railway.app)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Autorisez Railway à accéder à votre compte GitHub si nécessaire
5. Sélectionnez le dépôt `taxi-website`

### 2. Ajouter une base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database"** puis **"Add PostgreSQL"**
3. Railway créera automatiquement une base de données PostgreSQL
4. La variable d'environnement `DATABASE_URL` sera automatiquement ajoutée à votre service

### 3. Configurer les variables d'environnement

1. Dans votre service (l'application Next.js), allez dans l'onglet **"Variables"**
2. Vérifiez que `DATABASE_URL` est bien présente (elle devrait être automatiquement ajoutée si vous avez lié la base de données)
3. Si vous avez d'autres variables d'environnement, ajoutez-les ici

### 4. Lier la base de données au service

1. Dans votre service Next.js, allez dans l'onglet **"Settings"**
2. Dans la section **"Service"**, cliquez sur **"Connect"** à côté de votre base de données PostgreSQL
3. Cela ajoutera automatiquement la variable `DATABASE_URL` si ce n'est pas déjà fait

### 5. Exécuter les migrations de base de données

Railway exécutera automatiquement le build qui inclut `prisma generate`. Pour les migrations :

**Option A : Via Railway CLI (recommandé)**

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier au projet
railway link

# Exécuter les migrations
railway run npx prisma migrate deploy
```

**Option B : Via le terminal Railway**

1. Dans votre service, allez dans l'onglet **"Deployments"**
2. Cliquez sur le dernier déploiement
3. Ouvrez le terminal
4. Exécutez : `npx prisma migrate deploy`

**Option C : Via un script de déploiement**

Vous pouvez ajouter un script dans `package.json` :

```json
"deploy": "prisma migrate deploy && next build"
```

### 6. (Optionnel) Peupler la base de données

Si vous voulez ajouter des données initiales :

```bash
railway run npm run db:seed
```

Ou via le terminal Railway :

```bash
npm run db:seed
```

### 7. Vérifier le déploiement

1. Une fois le déploiement terminé, Railway vous fournira une URL publique
2. Visitez l'URL pour vérifier que l'application fonctionne
3. Testez la page de réservation pour vérifier la connexion à la base de données

## Configuration automatique

Railway détectera automatiquement :
- ✅ Next.js (via `package.json`)
- ✅ Node.js (version via `package.json` ou `.nvmrc`)
- ✅ Scripts de build et de démarrage

Le fichier `railway.json` configure :
- Le builder (NIXPACKS)
- La commande de build
- La commande de démarrage
- La politique de redémarrage

## Scripts automatiques

- **`postinstall`** : Génère automatiquement le client Prisma après `npm install`
- **`build`** : Génère Prisma puis build Next.js
- **`start`** : Démarre le serveur Next.js en production

## Dépannage

### Erreur : "Prisma Client not generated"

Solution : Vérifiez que `postinstall` est bien exécuté. Vous pouvez forcer la génération avec :
```bash
railway run npm run db:generate
```

### Erreur : "Database connection failed"

Solution : 
1. Vérifiez que la base de données est bien liée au service
2. Vérifiez que `DATABASE_URL` est bien définie dans les variables d'environnement
3. Vérifiez que les migrations ont été exécutées

### Erreur : "Module not found"

Solution : Vérifiez que toutes les dépendances sont dans `dependencies` et non `devDependencies` pour la production.

## Variables d'environnement requises

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | URL de connexion PostgreSQL | Automatique (Railway DB) |

## Support

Pour plus d'informations, consultez :
- [Documentation Railway](https://docs.railway.app)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)










