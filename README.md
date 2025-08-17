# VidaPlus SGHSS

Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS) para a instituição VidaPlus, que administra hospitais, clínicas, laboratórios e equipes de home care. O sistema centraliza o cadastro e atendimento de pacientes, gestão de profissionais, administração hospitalar, telemedicina, segurança e compliance.

## Principais Funcionalidades

- **Cadastro e Atendimento de Pacientes:**

    - Cadastro de pacientes
    - Visualização de histórico clínico
    - Agendamento/cancelamento de consultas
    - Prontuários e exames
    - Teleconsulta

- **Gestão de Profissionais de Saúde:**

    - Cadastro de médicos, enfermeiros e técnicos
    - Gerenciamento de agendas
    - Atualização de prontuários
    - Emissão de receitas digitais

- **Administração Hospitalar:**

    - Gerenciamento de leitos
    - Relatórios financeiros
    - Controle de suprimentos

- **Telemedicina:**

    - Atendimentos e prescrições online
    - Marcação de consultas/exames presenciais
    - Videochamadas seguras

- **Segurança e Compliance:**
    - Controle de acesso por perfil
    - Criptografia de dados sensíveis
    - Registro de logs e auditoria
    - Conformidade com a LGPD

## Tecnologias

- Node.js + TypeScript
- Prisma ORM
- PostgreSQL (via Docker)
- Express.js
- Zod

## Como rodar o projeto

### Pré-requisitos

- [NodeJS v22.17.1](https://nodejs.org/dist/v22.18.0/node-v22.18.0-x64.msi)
- [VSCode](https://code.visualstudio.com)
- [GIT](https://git-scm.com/downloads)

1. Clone o repositório

    ```git
    git clone https://github.com/JesielPfeifer/VidaPlus.git
    ```

> OBS: Após baixar os programas de pré-requisito, você pode instalar a aplicação de forma automatizada basta executar o script install-app-windows.bat (para Windows) ou install-app.sh (Unix).

> OBS²: A aplicação pode ser inteiramente executada usando docker, para isso, basta executar o script "install-app-docker.bat".

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Suba o banco de dados com Docker:

    ```bash
    docker-compose up -d
    ```

4. Inicie o prisma-client:

    ```bash
    npx prisma generate
    ```

5. Execute as migrations do Prisma:

    ```bash
    npx prisma migrate deploy
    ```

6. (Opcional) Popule o banco com dados iniciais

    ```bash
    npx prisma db seed
    ```

7. Inicie a aplicação:

    ```bash
    npm run dev
    ```

Obs: para alterar algum dado das tabelas do prisma, faça a alteraçao no arquivo ./prisma/schema.prisma e rode o comando:

```bash
npx prisma migrate dev
```

## Exemplos de uso das APIs

_IMPORTANTE_
Devido a um bug do Prisma, é necessário o envio de datas como objeto Date() do JavaScript, por exemplo:

```js
/*
Bug documentado em: https://www.prisma.io/docs/orm/reference/prisma-schema-reference#datetime
*/
new Date('1999-04-03');
```

Todas as requisições estão disponiveis e documentadas em: https://documenter.getpostman.com/view/30201252/2sB3BGGpjD.

---
