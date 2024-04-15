# Utilisez l'image officielle Node.js comme image de base pour la construction
FROM node:14

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copiez tout le code source dans le répertoire de travail
COPY . .

RUN npm rebuild sqlite3 --update-binary

# Exposez le port 3001 pour un accès externe
EXPOSE 3001

# Définir les commandes à exécuter au moment de l'exécution
CMD ["node", "server.js"]