import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const UNIDADE_ID = '0bc488f0-210a-4bbd-813a-0dc858aa21ac';
const PACIENTE_ID = '0db3f79b-9ab0-45c8-a2bf-ecf63278d3ee';
const PROFISSIONAL_ID = 'c1a2b3d4-e5f6-7890-abcd-1234567890ef';
const CONSULTA_ID = '8a46fd2a-42da-4385-84da-79a105e8b775';
const AGENDA_ID = 'a1b2c3d4-e5f6-7890-abcd-1234567890ab';
const INTERNACAO_ID = 'f1e2d3c4-b5a6-7890-abcd-1234567890cd';
const TELEMEDICINA_ID = 'b2c3d4e5-f6a7-8901-bcde-2345678901ef';
const PRONTUARIO_ID = 'd4e5f6a7-b8c9-0123-def0-3456789012ab';
const PRESCRICAO_ID = 'e5f6a7b8-c9d0-1234-ef01-4567890123bc';

async function main() {
    await prisma.unidade.create({
        data: {
            id: UNIDADE_ID,
            nome: 'Hospital VidaPlus',
            endereco: 'Rua das Flores, 123',
        },
    });

    await prisma.paciente.create({
        data: {
            id: PACIENTE_ID,
            nome: 'João da Silva',
            cpf: '123.456.789-00',
            email: 'joao.silva@example.com',
            telefone: '11987654321',
            dataNascimento: new Date('1990-01-01'),
            genero: 'Masculino',
            unidadeId: UNIDADE_ID,
        },
    });
    await prisma.profissional.create({
        data: {
            id: PROFISSIONAL_ID,
            nome: 'Dra. Maria Oliveira',
            crm: '987.654.321-00',
            cargo: 'Cardiologista',
            especialidade: 'Cardiologia',
            unidadeId: UNIDADE_ID,
        },
    });

    await prisma.consulta.create({
        data: {
            id: CONSULTA_ID,
            pacienteId: PACIENTE_ID,
            profissionalId: PROFISSIONAL_ID,
            unidadeId: UNIDADE_ID,
            data: new Date('2023-01-01'),
            tipo: 'Consulta de Rotina',
            status: 'Agendada',
        },
    });

    await prisma.agenda.create({
        data: {
            id: AGENDA_ID,
            dataHora: new Date('2023-01-01'),
            tipo: 'Consulta',
            status: 'Agendada',
            pacienteId: PACIENTE_ID,
            profissionalId: PROFISSIONAL_ID,
        },
    });

    await prisma.internacao.create({
        data: {
            id: INTERNACAO_ID,
            pacienteId: PACIENTE_ID,
            unidadeId: UNIDADE_ID,
            leito: 'A1',
            status: 'Internado',
            dataEntrada: new Date('2023-01-01'),
            dataSaida: new Date('2023-01-10'),
        },
    });

    await prisma.telemedicina.create({
        data: {
            id: TELEMEDICINA_ID,
            consultaId: CONSULTA_ID,
            linkVideo: 'https://example.com/video',
            tokenAcesso: 'abcdef123456',
        },
    });

    await prisma.prontuario.create({
        data: {
            id: PRONTUARIO_ID,
            consultaId: CONSULTA_ID,
            pacienteId: PACIENTE_ID,
            profissionalId: PROFISSIONAL_ID,
            descricao:
                'Paciente com quadro estável. Prescrito repouso e hidratação.',
        },
    });

    await prisma.prescricao.create({
        data: {
            id: PRESCRICAO_ID,
            prontuarioId: PRONTUARIO_ID,
            medicamento: 'Paracetamol',
            dosagem: '500mg',
            observacoes: 'Tomar a cada 8 horas.',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
