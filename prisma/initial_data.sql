-- Inserir unidade hospitalar de exemplo
INSERT INTO unidade (id, nome, endereco, tipo, telefone)
VALUES (
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac',
  'Hospital VidaPlus Central',
  'Rua das Flores, 123',
  'hospital',
  '(11) 99999-9999'
);

-- Inserir paciente de exemplo
INSERT INTO paciente (nome, cpf, email, telefone, "dataNascimento", genero, "unidadeId")
VALUES (
  'Maria',
  '01232312391',
  'mari113b@exemplo.com',
  '01234567890',
  '1988-07-01',
  'Feminino',
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac'
);

-- Inserir profissional de saúde de exemplo
INSERT INTO profissional (id, nome, crm, especialidade, email, "unidadeId")
VALUES (
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  'Dr. João',
  '123456',
  'Cardiologia',
  'joao@exemplo.com',
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac'
);

-- Inserir consulta de exemplo
INSERT INTO consulta (id, "pacienteCpf", "profissionalId", "dataHora", tipo)
VALUES (
  '8a46fd2a-42da-4385-84da-79a105e8b775',
  '01232312391',
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  '2025-07-10T14:00:00Z',
  'Consulta'
);

-- Inserir teleconsulta de exemplo
INSERT INTO teleconsulta (id, "pacienteCpf", "profissionalId", "dataHora")
VALUES (
  '9aeb3eef-f77f-407a-8999-81f6e342a60a',
  '01232312391',
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  '2025-07-10T16:00:00Z'
);