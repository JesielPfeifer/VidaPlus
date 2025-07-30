-- Inserir unidade hospitalar de exemplo
INSERT INTO vidaplus.unidade (id, nome, endereco)
VALUES (
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac',
  'Hospital VidaPlus Central',
  'Rua das Flores, 123'
);

-- Inserir paciente de exemplo
INSERT INTO paciente (id, nome, cpf, email, telefone, dataNascimento, genero, unidadeId)
VALUES (
  '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee',
  'Maria',
  '01232312391',
  'mari113b@exemplo.com',
  '01234567890',
  '1988-07-01T14:00:00Z',
  'Feminino',
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac'
);

-- Inserir profissional de saúde de exemplo
INSERT INTO profissional (id, nome, crm, cargo, especialidade, unidadeId)
VALUES (
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  'Dr. João',
  '123456',
  'Cardiologia',
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac'
);

-- Inserir consulta de exemplo
INSERT INTO consulta (id, pacienteId, profissionalId, data, tipo, status)
VALUES (
  '8a46fd2a-42da-4385-84da-79a105e8b775',
  '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee',
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  '2025-07-10T14:00:00Z',
  'Consulta',
  'Agendado'
);

-- Inserir agenda de exemplo
INSERT INTO agenda (id, dataHora, tipo, status, pacienteId, profissionalId)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  '2025-07-10T13:00:00Z',
  'Consulta',
  'Agendado',
  '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee',
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef'
);

-- Inserir internacao de exemplo
INSERT INTO internacao (id, pacienteId, unidadeId, leito, dataEntrada, status)
VALUES (
  'f1e2d3c4-b5a6-7890-abcd-1234567890cd',
  '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee',
  '0bc488f0-210a-4bbd-813a-0dc858aa21ac',
  '101A',
  '2025-07-09T10:00:00Z',
  'Ativo'
);

-- Inserir telemedicina de exemplo
INSERT INTO telemedicina (id, consultaId, linkVideo, tokenAcesso)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-2345678901ef',
  '8a46fd2a-42da-4385-84da-79a105e8b775',
  'https://meet.vidaplus.com/teleconsulta/8a46fd2a',
  'token123'
);

-- Inserir prontuario de exemplo
INSERT INTO prontuario (id, consultaId, pacienteId, profissionalId, descricao)
VALUES (
  'd4e5f6a7-b8c9-0123-def0-3456789012ab',
  '8a46fd2a-42da-4385-84da-79a105e8b775',
  '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee',
  'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  'Paciente com quadro estável. Prescrito repouso e hidratação.'
);

-- Inserir prescricao de exemplo
INSERT INTO prescricao (id, prontuarioId, medicamento, dosagem, observacoes)
VALUES (
  'e5f6a7b8-c9d0-1234-ef01-4567890123bc',
  'd4e5f6a7-b8c9-0123-def0-3456789012ab',
  'Paracetamol',
  '500mg de 8/8h por 3 dias',
  'Em caso de febre persistente, retornar.'
);