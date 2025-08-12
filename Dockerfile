# Use a imagem oficial do Node.js v22

FROM node:22

#Apaga caso uma pasta da app já exista
RUN mkdir -p /app

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Exponha a porta em que sua aplicação irá rodar
EXPOSE 3333

CMD ["npm", "run", "dev"]

# Adiciona argumento e variável de ambiente para o banco
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copie o package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie o restante da aplicação para o diretório de trabalho no container
COPY . .

# Comando para iniciar a aplicação
RUN npx prisma generate

