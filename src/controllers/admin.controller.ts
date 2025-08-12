import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { AdminService } from '../services/admin.service';
import { JWT_SECRET } from '../constants/envs.constant';
import { LoginSchema, RegisterSchema } from '../schemas/authentication.schema';
import { hashPassword } from '../utils/bcrypt.util';
import { TokenService } from '../services/token.service';
import logger from '../lib/logger';
export class AdminController {
    private adminService: AdminService;
    private tokenService: TokenService;

    constructor() {
        this.adminService = new AdminService();
        this.tokenService = new TokenService();
    }

    public register = catchErrors(async (req: Request, res: Response) => {
        const request = RegisterSchema.parse(req.body);
        const { confirmaSenha, ...adminData } = request;

        const existsAdmin = await this.adminService.getAdminByEmail(
            request.email,
        );

        if (request.senha !== confirmaSenha) {
            logger.error(`Senhas não coincidem para o e-mail: ${request.email}`);
            res.status(BAD_REQUEST).json({
                error: 'Passwords do not match',
            });
            return;
        }

        if (existsAdmin) {
            logger.error(`E-mail já está em uso: ${request.email}`);

            res.status(BAD_REQUEST).json({
                error: 'E-mail is already in use. Please use a different one.',
            });
            return;
        }

        const hashedPassword = await hashPassword(request.senha);

        const newAdmin = await this.adminService.createAdmin({
            ...adminData,
            senha: hashedPassword,
        });

        if (!newAdmin) {
            logger.error(`Failed to create admin for e-mail: ${request.email}.`);
            res.status(INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error',
            });
            return;
        }

        const token = this.tokenService.signJwt(
            { id: newAdmin.id },
            JWT_SECRET,
            { expiresIn: '1h' },
        );

        if (token === null) {
            logger.error(`Failed to generate token for e-mail: ${request.email}.`);
            res.status(INTERNAL_SERVER_ERROR).json({
                error: 'Internal Server Error',
            });
            return;
        }

        logger.info(`Admin registered successfully: ${request.email}`);
        res.status(CREATED).json({
            token,
        });
        return;
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

        const validPassword = this.adminService.isValidPassword(
            request.email,
            request.senha,
        );

        if (!validPassword) {
            res.status(BAD_REQUEST).json({
                error: 'Invalid email or password',
            });
            return;
        }

        const token = jwt.sign(
            { id: adminUser.id, cargo: adminUser.perfil },
            JWT_SECRET,
            { expiresIn: '1d' },
        );

        res.status(OK).json({
            msg: 'Admin logged in successfully',
            token,
        });
    });
    public deleteAdmin = catchErrors(async (req: Request, res: Response) => {
        const AdminId = req.params.id;

        const deleteAdmin = await this.adminService.deleteAdmin(AdminId);

        if (!deleteAdmin) {
            res.status(BAD_REQUEST).json({ error: 'Failed to delete admin' });
            return;
        }

        res.status(OK).json({
            msg: 'Admin deleted successfully',
        });
    });

    public getAdminData = catchErrors(async (req: Request, res: Response) => {
        const adminEmail = req.body.email;

        const adminData = await this.adminService.getAdminByEmail(adminEmail);

        if (!adminData) {
            res.status(NOT_FOUND).json({ error: 'Admin not found' });
            return;
        }

        res.status(OK).json({ ...adminData });
    });
}
