# 📧 Configuration de l'envoi d'emails

Ce guide explique comment configurer l'envoi d'emails pour les réservations avec Brevo.

## 🔧 Configuration

### 1. Créer un compte Brevo

1. Allez sur [https://www.brevo.com](https://www.brevo.com)
2. Créez un compte gratuit (300 emails/jour gratuits)
3. Allez dans **Settings** > **SMTP & API** > **API Keys**
4. Créez une nouvelle clé API
5. Copiez votre clé API (commence par `xkeysib-`)

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données (déjà configurée)
DATABASE_URL="postgresql://user:password@localhost:5432/taxi_db?schema=public"

# Brevo API - Clé API obtenue sur https://app.brevo.com/settings/keys/api
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxx"

# Email de l'entreprise - Adresse qui recevra les notifications de nouvelles réservations
# ⚠️ IMPORTANT : C'est l'email où vous recevrez les notifications de nouvelles réservations
# Vous pouvez mettre plusieurs emails en les séparant par des virgules
COMPANY_EMAIL="contact@hern-taxi.fr"

# Email d'envoi - Adresse depuis laquelle les emails seront envoyés
# ⚠️ IMPORTANT : Cet email doit être vérifié dans votre compte Brevo
FROM_EMAIL="reservations@hern-taxi.fr"

# Nom de l'expéditeur (optionnel)
FROM_NAME="Hern Taxi"
```

### 3. Vérifier votre domaine (optionnel mais recommandé)

Pour utiliser votre propre domaine (ex: `reservations@hern-taxi.fr`) :

1. Allez dans **Settings** > **Senders & IP** sur Brevo
2. Cliquez sur **Add a sender**
3. Ajoutez votre adresse email (ex: `reservations@hern-taxi.fr`)
4. Vérifiez votre email en cliquant sur le lien dans l'email de confirmation
5. Une fois vérifié, vous pouvez utiliser cette adresse dans `FROM_EMAIL`

**Note :** Pour tester rapidement, vous pouvez utiliser votre email personnel vérifié dans Brevo.

## 📨 Types d'emails envoyés

Lorsqu'une réservation est créée, **deux emails** sont envoyés :

### 1. Email de confirmation au client
- **Destinataire :** L'email du client qui a fait la réservation
- **Contenu :** Confirmation avec tous les détails de la réservation
- **Sujet :** `Confirmation de demande de réservation #XXXXXXXX`

### 2. Email de notification à l'entreprise
- **Destinataire :** L'email configuré dans `COMPANY_EMAIL`
- **Contenu :** Notification avec les informations client et détails de la réservation
- **Sujet :** `🆕 Nouvelle réservation #XXXXXXXX - [Type de service]`

## ⚙️ Configuration des adresses email

### Pour changer l'email qui reçoit les notifications :

Modifiez la variable `COMPANY_EMAIL` dans votre fichier `.env` :

```env
COMPANY_EMAIL="votre-email@exemple.com"
```

Vous pouvez mettre plusieurs emails en les séparant par des virgules :

```env
COMPANY_EMAIL="contact@hern-taxi.fr,admin@hern-taxi.fr"
```

### Pour changer l'email d'envoi :

Modifiez la variable `FROM_EMAIL` dans votre fichier `.env` :

```env
FROM_EMAIL="reservations@hern-taxi.fr"
```

⚠️ **Important :** L'email dans `FROM_EMAIL` doit être vérifié dans votre compte Brevo.

## 🧪 Tester l'envoi d'emails

1. Assurez-vous que toutes les variables d'environnement sont configurées
2. Redémarrez votre serveur de développement : `npm run dev`
3. Créez une réservation de test via le formulaire
4. Vérifiez :
   - Les logs dans la console (devraient afficher "✅ Email envoyé")
   - La boîte de réception du client
   - La boîte de réception de l'entreprise (`COMPANY_EMAIL`)

## 🐛 Dépannage

### Les emails ne sont pas envoyés

1. **Vérifiez les variables d'environnement :**
   ```bash
   # Vérifiez que les variables sont bien définies
   echo $BREVO_API_KEY
   echo $COMPANY_EMAIL
   echo $FROM_EMAIL
   ```

2. **Vérifiez les logs :**
   - Si vous voyez `⚠️ BREVO_API_KEY non configurée`, la clé API n'est pas définie
   - Si vous voyez `⚠️ COMPANY_EMAIL non configurée`, l'email de l'entreprise n'est pas défini
   - Si vous voyez `❌ Erreur lors de l'envoi`, vérifiez votre clé API Brevo

3. **Vérifiez votre compte Brevo :**
   - Allez sur [Brevo Dashboard](https://app.brevo.com/statistics/email)
   - Vérifiez si les emails apparaissent dans les logs
   - Vérifiez les erreurs éventuelles

### L'email FROM n'est pas vérifié

Si vous utilisez un email personnalisé (ex: `reservations@hern-taxi.fr`), vous devez :
1. Ajouter votre email dans Brevo (Settings > Senders & IP)
2. Vérifier l'email en cliquant sur le lien dans l'email de confirmation
3. Attendre la vérification (peut prendre quelques minutes)

## 📚 Ressources

- [Documentation Brevo API](https://developers.brevo.com/docs)
- [Guide de vérification d'email](https://help.brevo.com/hc/fr/articles/209467485)
- [Limites et quotas Brevo](https://help.brevo.com/hc/fr/articles/360012635399)
