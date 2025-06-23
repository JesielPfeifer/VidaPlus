import { z } from 'zod';

export const PacienteSchema = z.object({
    nome: z.string(),
    cpf: z.string().length(11),
    email: z.string().email(),
    telefone: z.string(),
    dataNascimento: z.string().or(z.date()),
    genero: z.string(),
    unidadeId: z.string().uuid(),
});

export const ProfissionalSchema = z.object({
    nome: z.string(),
    crm: z.string().optional(),
    coren: z.string().optional(),
    cargo: z.string(),
    especialidade: z.string().optional(),
    unidadeId: z.string().uuid(),
});

export const AgendaSchema = z.object({
    dataHora: z.string().or(z.date()),
    tipo: z.enum(['Consulta', 'Exame', 'Telemedicina']),
    status: z.enum(['Agendado', 'Cancelado', 'Concluído']),
    pacienteId: z.string().uuid(),
    profissionalId: z.string().uuid(),
});

export const ConsultaSchema = z.object({
    pacienteId: z.string().uuid(),
    profissionalId: z.string().uuid(),
    unidadeId: z.string().uuid(),
    data: z.string().or(z.date()),
    tipo: z.enum(['Consulta', 'Exame', 'Telemedicina']),
    status: z.enum(['Agendada', 'Cancelada', 'Concluída']),
    observacoes: z.string().optional(),
});

export const TelemedicinaSchema = z.object({
    consultaId: z.string().uuid(),
    linkVideo: z.string().url(),
    tokenAcesso: z.string(),
});

export const ProntuarioSchema = z.object({
    consultaId: z.string().uuid(),
    pacienteId: z.string().uuid(),
    profissionalId: z.string().uuid(),
    descricao: z.string(),
});

export const PrescricaoSchema = z.object({
    prontuarioId: z.string().uuid(),
    medicamento: z.string(),
    dosagem: z.string(),
    observacoes: z.string().optional(),
});

export const UnidadeSchema = z.object({
    nome: z.string(),
    endereco: z.string(),
});

export const InternacaoSchema = z.object({
    pacienteId: z.string().uuid(),
    unidadeId: z.string().uuid(),
    leito: z.string(),
    dataEntrada: z.string().or(z.date()),
    dataSaida: z.string().or(z.date()).optional(),
    status: z.enum(['Internado', 'Alta', 'Transferido']),
});
