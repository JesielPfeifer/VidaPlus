=======================
📌 UNIDADE
=======================
POST /unidade

{
"nome": "Hospital VidaPlus",
"endereco": "Av. Saúde, 123"
}

=======================
📌 PACIENTE
=======================
POST /paciente

{
"nome": "Maria Silva",
"cpf": "12345678900",
"email": "maria@exemplo.com",
"telefone": "11999999999",
"dataNascimento": "1988-07-01T00:00:00.000Z",
"genero": "Feminino",
"unidadeId": "UUID_DA_UNIDADE"
}

=======================
📌 PROFISSIONAL
=======================
POST /profissional

{
"nome": "Dr. João",
"crm": "123456-SP",
"coren": null,
"cargo": "Médico",
"especialidade": "Cardiologia",
"unidadeId": "UUID_DA_UNIDADE"
}

=======================
📌 AGENDA
=======================
POST /agenda

{
"dataHora": "2025-06-10T10:00:00.000Z",
"tipo": "Consulta",
"status": "Agendado",
"pacienteId": "UUID_DO_PACIENTE",
"profissionalId": "UUID_DO_PROFISSIONAL"
}

=======================
📌 CONSULTA
=======================
POST /consulta

{
"pacienteId": "UUID_DO_PACIENTE",
"profissionalId": "UUID_DO_PROFISSIONAL",
"unidadeId": "UUID_DA_UNIDADE",
"data": "2025-06-10T10:00:00.000Z",
"tipo": "Consulta",
"status": "Concluído",
"observacoes": "Paciente apresentou sintomas leves de gripe."
}

=======================
📌 TELEMEDICINA
=======================
POST /telemedicina

{
"consultaId": "UUID_DA_CONSULTA",
"linkVideo": "https://meet.vidaplus.com/abc123",
"tokenAcesso": "securetoken123"
}

=======================
📌 PRONTUÁRIO
=======================
POST /prontuario

{
"consultaId": "UUID_DA_CONSULTA",
"pacienteId": "UUID_DO_PACIENTE",
"profissionalId": "UUID_DO_PROFISSIONAL",
"descricao": "Paciente com sintomas gripais. Prescrito repouso e hidratação."
}

=======================
📌 PRESCRIÇÃO
=======================
POST /prescricao

{
"prontuarioId": "UUID_DO_PRONTUARIO",
"medicamento": "Paracetamol",
"dosagem": "500mg a cada 8h por 3 dias",
"observacoes": "Tomar após as refeições"
}

=======================
📌 INTERNAÇÃO
=======================
POST /internacao

{
"pacienteId": "UUID_DO_PACIENTE",
"unidadeId": "UUID_DA_UNIDADE",
"leito": "Leito 203",
"dataEntrada": "2025-06-08T14:00:00.000Z",
"dataSaida": null,
"status": "Ativa"
}
