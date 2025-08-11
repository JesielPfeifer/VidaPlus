@echo off
setlocal ENABLEDELAYEDEXPANSION

echo.
echo ============================================
echo        VIDA PLUS - INSTALACAO AUTOMATICA
echo ============================================
echo.

echo [1/6] Instalando dependencias...
call npm install >> first-run-bat.log 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Dependencias instaladas com sucesso.
) else (
    echo [ERRO] Falha ao instalar dependencias. Verifique o arquivo first-run-bat.log.
    pause
    exit /b 1
)

echo.
echo [2/6] Subindo banco de dados com Docker...
docker-compose up -d >> first-run-bat.log 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Banco de dados iniciado com sucesso.
) else (
    echo [ERRO] Falha ao subir o banco de dados. Verifique o arquivo first-run-bat.log.
    pause
    exit /b 1
)

echo.
echo [3/6] Gerando Prisma Client...
call npx prisma generate >> first-run-bat.log 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Prisma Client gerado com sucesso.
) else (
    echo [ERRO] Falha ao gerar Prisma Client. Verifique o arquivo first-run-bat.log.
    pause
    exit /b 1
)

echo.
echo [4/6] Executando migrations do Prisma...
call npx prisma migrate deploy >> first-run-bat.log 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Migrations aplicadas com sucesso.
) else (
    echo [ERRO] Falha ao executar migrations. Verifique o arquivo first-run-bat.log.
    pause
    exit /b 1
)

:SEED_MENU
echo.
echo ============================================
echo        ETAPA OPCIONAL: POPULAR BANCO
echo ============================================
set /p SEED_CHOICE="Deseja popular o banco de dados com dados iniciais? (s/n): "
echo.
if /i "%SEED_CHOICE%"=="s" (
    echo.
    echo [5/6] Populando banco de dados com dados iniciais...
    npx prisma db seed >> first-run-bat.log 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Banco populado com sucesso.
    ) else (
        echo [ERRO] Falha ao popular o banco. Verifique o arquivo first-run-bat.log.
        pause
        exit /b 1
    )
) else if /i "%SEED_CHOICE%"=="n" (
    echo.
    echo Pulando a populacao do banco de dados.
) else (
    echo.
    echo Opção invalida. Por favor, digite 's' ou 'n'.
    goto SEED_MENU
)

echo.
echo [6/6] Instalacao concluida!
echo ============================================
echo Aplicacao configurada e pronta para uso.
echo Para iniciar a API, execute: npm run dev
echo ============================================
echo.
echo Consulte o arquivo first-run-bat.log para mais