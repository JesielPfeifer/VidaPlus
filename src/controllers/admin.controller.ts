import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { AdminService } from '../services/admin.service';
import { JWT_SECRET } from '../constants/envs.constant';
import { LoginSchema, RegisterSchema } from '../schemas/authentication.schema';
import { comparePasswords, hashPassword } from '../utils/bcrypt.util';
import { signJwt } from '../utils/jwt.utils';
export class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    public register = catchErrors(async (req: Request, res: Response) => {
        const request = RegisterSchema.parse(req.body);

        const existsAdmin = await this.adminService.getAdminByEmail(
            request.email,
        );

        if (existsAdmin) {
            res.status(BAD_REQUEST).json({
                error: 'E-mail is already in use. Please use a different one.',
            });
            return;
        }

        const hashedPassword = await hashPassword(request.senha);

        const newAdmin = await this.adminService.createAdmin({
            ...request,
            senha: hashedPassword,
        });

        const token = signJwt({ id: newAdmin.id });

        res.status(CREATED).json({
            msg: 'Admin registered successfully',
            usuario: {
                id: newAdmin.id,
                nome: newAdmin.nome,
                email: newAdmin.email,
            },
            token,
        });
    });

    public login = catchErrors(async (req: Request, res: Response) => {
        const request = LoginSchema.parse(req.body);

        const adminUser = await this.adminService.getAdminByEmail(
            request.email,
        );

        if (!adminUser) {
            res.status(NOT_FOUND).json({ error: 'Invalid email or password' });
            return;
        }

        const validPassword = await comparePasswords(
            request.senha,
            adminUser.senha,
        );

        if (!validPassword) {
            res.status(BAD_REQUEST).json({
                error: 'Invalid email or password',
            });
            return;
        }

        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email },
            JWT_SECRET,
            { expiresIn: '1d' },
        );

        res.status(OK).json({
            msg: 'Admin logged in successfully',
            usuario: adminUser,
            token,
        });
    });
}
