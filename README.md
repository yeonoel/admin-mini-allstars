# 🛒 Admin Dashboard E-commerce

Dashboard d'administration pour une plateforme de vente de sneakers. Gestion complète des produits, commandes, clients et analytics.

##  Aperçu

![Dashboard Overview](screenshot-overview.png)

## Fonctionnalités

-  **Authentification** - Connexion sécurisée
-  **Dashboard** - Vue d'ensemble avec KPIs et graphiques
-  **products** - CRUD complet avec upload d'images
-  **orders** - Gestion et suivi des commandes
-  **customers** - Base de données clients
-  **Analytics** - Statistiques avancées
-  **settings** - Configuration du store

##  Technologies

- **React 18** + **TypeScript**
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Graphiques
- **React Hook Form** + **Yup** - Formulaires
- **Axios** - API calls

##  Installation

```bash
# Cloner le repo
git clone https://github.com/votre-username/admin-dashboard.git
cd admin-dashboard

# Installer les dépendances
npm install

# Démarrer en mode dev
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Configuration

Créer un fichier `.env` à la racine :

```env
REACT_APP_API_URL=http://localhost:3000/api
```

##  Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── common/      # Boutons, inputs, tables...
│   ├── layout/      # Sidebar, header, layout
│   └── features/    # Composants par page
├── pages/           # Pages principales
├── hooks/           # Custom hooks
├── services/        # API calls
├── contexts/           # context
├── types/           # Types TypeScript
└── utils/           # Fonctions utilitaires
```



## Backend requis

Ce dashboard nécessite un backend Nest.js avec les endpoints suivants :
[Backend du projet](https://github.com/yeonoel/back-ecommerce)

- `POST /api/auth/login` - Connexion
- `GET /api/overview/stats` - Statistiques dashboard
- `GET /api/products` - Liste produits
- `POST /api/products` - Créer produit
- `PUT /api/products/:id` - Modifier produit
- `DELETE /api/products/:id` - Supprimer produit
- `GET /api/orders` - Liste commandes
- `GET /api/customers` - Liste clients
- `GET /api/analytics` - Données analytics
- `GET /api/settings` - Paramètres
- `PUT /api/settings` - Modifier paramètres

## Features en détail

### Dashboard
- 4 KPI cards (Revenue, Orders, Products, Customers)
- Graphique de revenus mensuel
- Ventes par catégorie
- Commandes récentes
- Top produits

### Produits
- Table avec images et détails
- Filtres par catégorie et statut
- Ajout/modification avec upload d'image
- Gestion du stock avec alertes
- Suppression avec confirmation

### Commandes
- Filtres avancés (statut, date, recherche)
- Export Excel
- Détails de commande
- Statuts colorés
- Pagination

### Clients
- Liste avec infos de contact
- Statut VIP
- Historique d'achats
- Email campaign

### Analytics
- Métriques avancées
- Graphiques multiples
- Revenue par catégorie
- Top produits
- Sources de traffic

## Développement

### Ajouter une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `App.tsx`
3. Ajouter le lien dans la sidebar

### Ajouter un nouvel endpoint API

1. Ajouter le type dans `src/types/`
2. Créer la fonction API dans `src/services/api.ts`
3. Créer le hook React Query dans `src/hooks/`

### Créer un composant réutilisable

1. Créer dans `src/components/common/`
2. Définir les props avec TypeScript
3. Ajouter des exemples d'utilisation

##  Debugging

### React DevTools
Installer l'extension Chrome/Firefox pour inspecter les composants

### Redux DevTools
Voir les actions et l'état Redux en temps réel

### TypeScript Errors
Vérifier la configuration dans `tsconfig.json`


##  Auteur

**Votre Nom**
- GitHub: [@yeonoel](https://github.com/yeonoel)
---

⭐ Si ce projet vous a aidé, n'hésitez pas à mettre une étoile !