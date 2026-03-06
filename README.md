# 🍔 Sim'sBurger - Application de Fast Food

## Table des matières

- Aperçu du projet
- Architecture technique
- Fonctionnalités
- Installation
- Configuration
- Base de données
- API Documentation
- Authentification
- Interface utilisateur
- Fonctionnalités avancées
- Contribution

---

## Aperçu du projet

**Sim'sBurger** est une application web complète de restauration rapide permettant aux clients de passer commande en ligne et à l'équipe d'administration de gérer efficacement les opérations. L'application se compose de deux interfaces distinctes :

- **Interface Client** : Navigation dans le menu, personnalisation des burgers, commande (sur place/emporter/livraison), programme de fidélité
- **Interface Admin** : Gestion des utilisateurs, inventaire, fournisseurs, statistiques, validation des comptes administrateurs

---

## Architecture technique

### Stack technique

#### Backend

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MySQL avec Sequelize ORM
- **Authentification** : JWT (JSON Web Tokens) avec cookies httpOnly
- **Emails** : Mailjet
- **Téléchargement fichiers** : Multer
- **Temps réel** : Socket.io
- **Export CSV** : json2csv
- **Sécurité** : Helmet, express-rate-limit, bcrypt

#### Frontend

- **Framework** : React 19
- **Routing** : React Router v7
- **État** : Context API
- **UI Components** : Material UI (MUI)
- **Styling** : CSS pur
- **Temps réel** : Socket.io-client
- **Génération PDF** : jsPDF
- **Graphiques** : Recharts
- **Notifications** : React Toastify
- **Carrousel** : React Slick

---

## Fonctionnalités

### Côté Client

#### Navigation et Catalogue

- Consultation du menu complet (burgers, menus, boissons, snacks, desserts)
- Filtrage par catégories
- Affichage des allergènes et valeurs nutritionnelles
- Statut des produits (disponible/indisponible) en temps réel via Socket.io

#### Personnalisation avancée

- Création de burgers personnalisés
- Ajout/retrait d'ingrédients
- Suppléments avec calcul automatique du prix
- Menus personnalisables (choix boisson + accompagnement)

#### Commande

- **3 modes de commande** :
  - Sur place (paiement au guichet)
  - À emporter
  - Livraison à domicile
- Calcul automatique des frais de livraison basé sur la distance
- Validation horaire (commandes possibles uniquement de 11h à 23h)
- Génération de reçu PDF après commande

#### Programme de fidélité

- **BitSim's** : points de fidélité (1 point = 5€ dépensés)
- Code fidélité personnel (5 chiffres)
- Utilisation des points pour réduire le montant de la commande
- Historique des points cumulés et utilisés

#### Compte utilisateur

- Inscription avec validation par email
- Connexion sécurisée (cookies httpOnly)
- Historique des commandes
- Gestion du profil (modification, suppression)
- Réinitialisation mot de passe par code temporaire

#### Service client

- Formulaire de contact
- FAQ interactive
- Localisation du restaurant (Google Maps)
- Horaires d'ouverture

### Côté Administration

#### Gestion des administrateurs

- Création de comptes admin avec validation par superadmin
- Hiérarchie des rôles (admin, superadmin)
- Connexion sécurisée
- Gestion complète des utilisateurs admin (CRUD)

#### Inventaire

- Enregistrement des inventaires produits
- Alerte automatique par email pour stocks critiques (≤ 2 unités)
- Export des inventaires en CSV
- Historique des inventaires avec responsable

#### Fournisseurs

- Gestion des fournisseurs (CRUD)
- Upload de logo produit
- Informations de contact

#### Produits

- Activation/désactivation des produits en temps réel
- Synchronisation Socket.io avec le frontend client
- Initialisation automatique des produits

#### Statistiques

- Enregistrement des statistiques de vente
- Visualisation des revenus
- Suivi des performances

#### Messages

- Consultation des messages clients
- Suppression automatique des messages de plus de 3 mois

---

## Installation

### Prérequis

- Node.js (v18+)
- MySQL (v8+)
- Compte Mailjet pour les envois d'emails

### Backend

```bash
# Cloner le dépôt
git clone https://github.com/simodimi/simsburger.git
cd simsburger/backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Initialiser la base de données
node controllers/admin/Initsuperadmin.js

# Démarrer le serveur
npm run dev
```

### Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Démarrer l'application
npm run dev
```

---

## Configuration

### Variables d'environnement Backend (.env)

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=simsburger
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_jwt

# Emails (Mailjet)
EMAIL_USER=votre_api_key_mailjet
EMAIL_PASSWORD=votre_secret_mailjet
SUPERADMIN_EMAIL=superadmin@example.com
SUPERADMIN_PASSWORD=ChangeMe123!

# URL de base
BASE_URL=http://localhost:5000

# Environnement
NODE_ENV=development
```

### Variables d'environnement Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Base de données

### Modèles principaux

#### Admin

- `idadmin` (PK)
- `adminname`, `adminemail`, `adminpassword`
- `role` (admin/superadmin)
- `isactive`, `validationToken`

#### User

- `iduser` (PK)
- `nameuser`, `mailuser`, `passworduser`
- `pointscumules`, `pointsutilises`
- `valuecode` (code fidélité)

#### Orderitem

- `id` (PK)
- `product_id`, `order_id`
- `names`, `quantity`, `price`, `extraPrice`
- `type` (sur place/emporter/livraison)
- `isCustom`, `customItems`, `removedItems`
- `adresse`, `prixLivraison`, `telephone`

#### Inventaireadmin

- `id` (PK)
- `nomproduit`, `numserie`, `numstock`
- `dateperemption`, `perte`, `commentaire`
- `admin_id` (FK)

---

## API Documentation

### Routes Utilisateur

| Méthode | Endpoint                | Description               |
| ------- | ----------------------- | ------------------------- |
| POST    | `/user`                 | Création compte           |
| POST    | `/user/login`           | Connexion                 |
| POST    | `/user/logout`          | Déconnexion               |
| GET     | `/user/verify/token`    | Vérification token        |
| GET     | `/user/points`          | Récupération points       |
| POST    | `/user/updatePoints`    | Mise à jour points        |
| POST    | `/user/updatecode`      | Mise à jour code fidélité |
| GET     | `/user/verifycodeuser`  | Vérification code         |
| POST    | `/user/forgot-password` | Mot de passe oublié       |
| POST    | `/user/verify-code`     | Vérification code         |
| POST    | `/user/reset-password`  | Réinitialisation          |

### Routes Commande

| Méthode | Endpoint                    | Description            |
| ------- | --------------------------- | ---------------------- |
| POST    | `/orderitem`                | Création commande      |
| GET     | `/orderitem`                | Récupération commandes |
| DELETE  | `/orderitem/order/:orderId` | Suppression commande   |

### Routes Admin

| Méthode | Endpoint                   | Description       |
| ------- | -------------------------- | ----------------- |
| POST    | `/admin`                   | Création admin    |
| POST    | `/admin/login`             | Connexion admin   |
| GET     | `/admin/validation/:token` | Validation compte |
| GET     | `/admin/status/:idadmin`   | Statut admin      |

### Routes Inventaire

| Méthode | Endpoint               | Description              |
| ------- | ---------------------- | ------------------------ |
| POST    | `/inventaire`          | Création inventaire      |
| GET     | `/inventaire`          | Récupération inventaires |
| DELETE  | `/inventaire/:id`      | Suppression              |
| GET     | `/inventaire/download` | Export CSV               |

---

## Authentification

### Système de sécurité

- **Cookies httpOnly** : Les tokens JWT sont stockés dans des cookies sécurisés
- **Bcrypt** : Hachage des mots de passe (salt rounds: 12)
- **Validation par email** : Tokens uniques pour validation des comptes
- **Rate limiting** : Protection contre les attaques par force brute
- **CORS** : Configuration stricte des domaines autorisés

### Flux d'authentification

1. **Inscription** → Création compte + email validation
2. **Connexion** → Génération token JWT + cookie httpOnly
3. **Vérification** → Middleware verifyToken sur routes protégées
4. **Déconnexion** → Suppression du cookie

---

## Interface utilisateur

### Pages principales

#### Accueil (`/`)

- Hero section avec chef
- Promotions et nouveautés
- Carrousel de produits
- Footer avec liens rapides

#### Carte (`/carte`)

- Navigation par catégories
- Grille de produits
- Statut des produits (disponible/indisponible)

#### Description produit (`/carte/:categorie/:text`)

- Informations détaillées
- Allergènes et valeurs nutritionnelles
- Personnalisation des burgers
- Composition du menu (pour menus)

#### Panier (`/nouveauté`)

- Récapitulatif commande
- Modification quantités
- Application code fidélité
- Choix mode de commande
- Formulaire adresse (livraison)

#### Connexion (`/connecter`)

- Formulaire connexion
- Inscription
- Mot de passe oublié
- Historique commandes (connecté)
- Points fidélité

#### Service (`/service`)

- Présentation des services
- FAQ interactive
- Horaires d'ouverture

#### Contact (`/about`)

- Formulaire de contact
- Coordonnées
- Localisation Google Maps

### Composants réutilisables

- **Button** : Bouton personnalisable (acceptbtn, rejectbtn, nextbtn, retourbtn)
- **Footer** : Pied de page avec liens légaux
- **ProductContext** : Gestion globale du panier
- **Personnalisation** : Interface d'ajout/retrait d'ingrédients

---

## Fonctionnalités avancées

### Temps réel avec Socket.io

- **Mise à jour produits** : Quand un admin active/désactive un produit, tous les clients voient le changement instantanément
- **Nouvelles commandes** : Les admins reçoivent les commandes en temps réel
- **Salles dédiées** : `products_room`, `orders_room`

### Calcul des frais de livraison

1. Géolocalisation de l'utilisateur (ou saisie manuelle)
2. Géocodage avec Geoapify
3. Calcul de la distance routière
4. Application barème :
   - 0-2 km : gratuit
   - 2-5 km : 2.50€
   - 5-10 km : 5€
   - > 10 km : 8€ + 0.50€/km supplémentaire

### Programme de fidélité

- **Gain** : 1 BitSim's = 5€ d'achat
- **Utilisation** : Réduction immédiate sur commande
- **Code personnel** : 5 chiffres pour identifier l'utilisateur
- **Historique** : Suivi des points cumulés et utilisés

### Alertes automatiques

- **Stocks critiques** : Email au superadmin quand stock ≤ 2
- **Nouveaux admins** : Notification pour validation
- **Validation compte** : Email de confirmation

---

### Configuration production

- **HTTPS** obligatoire pour les cookies sécurisés
- **sameSite=None** pour cross-origin
- **CORS** configuré avec les domaines autorisés
- **Variables d'environnement** adaptées

---

## Contribution

### Guide de contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- **Backend** : Utilisation de `try/catch`, async/await
- **Frontend** : Hooks React, components fonctionnels
- **Nommage** : camelCase pour variables, PascalCase pour components
- **Commentaires** : Code auto-documenté, commentaires pour logique complexe

---

## Auteur

**Dimitri Simo**

- Email : simodimitri08@gmail.com
- GitHub : https://github.com/simodimi/

---

**Sim'sBurger** - _Ton burger, Ton kiff, Ton Sim'sburger_ 🍔
