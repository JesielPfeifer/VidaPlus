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

## Como rodar o projeto

1. Clone o repositório
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Suba o banco de dados com Docker:
    ```bash
    docker-compose up -d
    ```
4. Execute as migrations do Prisma:
    ```bash
    npx prisma migrate deploy
    ```
5. (Opcional) Popule o banco com dados de exemplo:

    ```bash
    psql -h localhost -U postgres -d sghss -f prisma/seed.sql
    ```

6. Inicie a aplicação:
    ```bash
    npm run dev
    ```

Obs: para alterar algum dado das tabelas do prisma, faça a alteraçao no arquivo ./prisma/schema.prisma e rode o comando `npx prisma migrate dev`

## Exemplos de uso das APIs

### Cadastro de Paciente

```json
{
    "nome": "Maria",
    "cpf": "01232312391",
    "email": "mari113b@exemplo.com",
    "telefone": "01234567890",
    "dataNascimento": "1988-07-01",
    "genero": "Feminino",
    "unidadeId": "0bc488f0-210a-4bbd-813a-0dc858aa21ac"
}
```

### Atualização de Paciente

```json
{
    "email": "novoemail@exemplo.com",
    "telefone": "11999999999"
}
```

### Cadastro de Profissional de Saúde

```json
{
    "nome": "Dr. João",
    "crm": "123456",
    "especialidade": "Cardiologia",
    "email": "joao@exemplo.com",
    "unidadeId": "0bc488f0-210a-4bbd-813a-0dc858aa21ac"
}
```

### Agendamento de Consulta

```json
{
    "pacienteCpf": "01232312391",
    "profissionalId": "c1a2b3d4-e5f6-7890-abcd-1234567890ef",
    "dataHora": "2025-07-10T14:00:00Z",
    "tipo": "Consulta"
}
```

### Teleconsulta

```json
{
    "pacienteCpf": "01232312391",
    "profissionalId": "c1a2b3d4-e5f6-7890-abcd-1234567890ef",
    "dataHora": "2025-07-10T16:00:00Z"
}
```

## Segurança

- Controle de acesso por perfil de usuário
- Dados sensíveis criptografados
- Logs de auditoria para todas as operações críticas
- Conformidade com a LGPD

## Escalabilidade e Disponibilidade

- Suporte a múltiplas unidades hospitalares
- Backups automáticos e logs robustos
- Disponibilidade mínima de 99,5%

---
