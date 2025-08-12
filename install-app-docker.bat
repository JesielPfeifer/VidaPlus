@echo off
setlocal ENABLEDELAYEDEXPANSION

echo.
echo [1/4] Buildando containers...
docker-compose build > docker-install.log 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao buildar containers. Veja docker-install.log
    exit /b 1
)

echo.
echo [2/4] Inicializando containers...
docker-compose up -d >> docker-install.log 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao subir containers. Veja docker-install.log
    exit /b 1
)

echo.
echo [3/4] Aplicando migrations...
docker-compose exec app npx prisma migrate deploy >> docker-install.log 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao aplicar migrations. Veja docker-install.log
    exit /b 1
)

echo.
echo ============================================
echo ETAPA OPCIONAL: POPULAR BANCO DE DADOS
echo ============================================
set /p SEED_CHOICE="Deseja popular o banco de dados com dados iniciais? (s/n): "
if /i "!SEED_CHOICE!"=="s" (
    echo [4/4] Populando banco de dados...
    docker-compose exec app npx prisma db seed >> docker-install.log 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao popular banco. Veja docker-install.log
        exit /b 1
    )
    echo.
    echo [OK] Banco de dados populado!
) else (
    echo.
    echo Pulando a populacao do banco de dados.
)

echo.
echo [OK] Instalacao concluida!
endlocal
goto :eof
