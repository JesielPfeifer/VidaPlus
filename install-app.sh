#!/bin/bash

LOG_FILE="first-run-sh.log"

echo
echo "============================================"
echo "       VIDA PLUS - INSTALACAO AUTOMATICA"
echo "============================================"
echo

echo "[1/6] Instalando dependencias..."
npm install >> $LOG_FILE 2>&1
if [ $? -eq 0 ]; then
    echo "[OK] Dependencias instaladas com sucesso."
else
    echo "[ERRO] Falha ao instalar dependencias. Verifique o arquivo $LOG_FILE."
    read -p "Pressione uma tecla para continuar"
    exit 1
fi

echo
echo "[2/6] Subindo banco de dados com docker..."
docker-compose up -d >> $LOG_FILE 2>&1
if [ $? -eq 0 ]; then
    echo "[OK] Banco de dados iniciado com sucesso."
else
    echo "[ERRO] Falha ao subir o banco de dados. Verifique o arquivo $LOG_FILE."
    read -p "Pressione uma tecla para continuar"
    exit 1
fi

echo
echo "[3/6] Gerando Prisma Client..."
npx prisma generate >> $LOG_FILE 2>&1
if [ $? -eq 0 ]; then
    echo "[OK] Prisma Client gerado com sucesso."
else
    echo "[ERRO] Falha ao gerar Prisma Client. Verifique o arquivo $LOG_FILE."
    read -p "Pressione uma tecla para continuar"
    exit 1
fi

echo
echo "[4/6] Executando migrations do Prisma..."
npx prisma migrate deploy >> $LOG_FILE 2>&1
if [ $? -eq 0 ]; then
    echo "[OK] Migrations aplicadas com sucesso."
else
    echo "[ERRO] Falha ao executar migrations. Verifique o arquivo $LOG_FILE."
    read -p "Pressione uma tecla para continuar"
    exit 1
fi

while true; do
    echo
    echo "============================================"
    echo "       ETAPA OPCIONAL: POPULAR BANCO"
    echo "============================================"
    read -p "Deseja popular o banco com dados iniciais? (s/n): " yn
    case $yn in
        [Ss]* ) 
            echo
            echo "[5/6] Populando banco com dados iniciais..."
            npx prisma db seed >> $LOG_FILE 2>&1
            if [ $? -eq 0 ]; then
                echo "[OK] Banco populado com sucesso."
            else
                echo "[ERRO] Falha ao popular o banco. Verifique o arquivo $LOG_FILE"
                read -p "Pressione uma tecla para continuar"
                exit 1
            fi
            break;;
        [Nn]* ) 
            echo
            echo "Pulando etapa de populacao do banco."
            break;;
        * ) echo "Por favor, responda com s ou n.";;
    esac
done

echo
echo "[6/6] Instalacao concluida!"
echo "============================================"
echo "Aplicacao configurada e pronta para uso."
echo "Para iniciar a API, execute: npm run dev"
echo "============================================"
echo
echo "Consulte o arquivo $LOG_FILE para mais"
read -p "Pressione uma tecla para continuar"