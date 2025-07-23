import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { PatientService } from '../services/patient.service';
import { HospitalService } from '../services/hospital.service';
import { ConsultaSchema } from '../schemas/schema';
import { ProfessionalService } from '../services/professional.service';
import { AppointmentService } from '../services/appointment.service';

export class AdminController {
    public async register(req: Request, res: Response) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res
                .status(BAD_REQUEST)
                .json({ error: 'Nome, email e senha são obrigatórios.' });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email },
        });
        if (usuarioExistente) {
            return res
                .status(BAD_REQUEST)
                .json({ error: 'E-mail já cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: { nome, email, senha: senhaHash },
        });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '1d' },
        );

        res.status(CREATED).json({
            msg: 'Admin registered successfully',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
            token,
        });
    }

    public async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res
                .status(BAD_REQUEST)
                .json({ error: 'E-mail e senha são obrigatórios.' });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res
                .status(NOT_FOUND)
                .json({ error: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(BAD_REQUEST).json({ error: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '1d' },
        );

        res.status(OK).json({
            msg: 'Admin logged in successfully',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
            token,
        });
    }
}
