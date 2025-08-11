import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';

export const checkingAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const validator = new TokenService();

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!authHeader) {
            res.status(401).json({ msg: 'Token não fornecido' });
            return;
        }
        if (!token) {
            res.status(401).json({ msg: 'Token inválido' });
            return;
        }

        const payload = validator.validateToken(token);
        console.log(payload);
        if (!payload || !payload.id) {
            res.status(401).json({ msg: 'Não autorizado' });
            return;
        }

        next();
    } catch (error: any) {
        res.status(500).json({ msg: 'Erro interno no servidor' });
        return;
    }
};
