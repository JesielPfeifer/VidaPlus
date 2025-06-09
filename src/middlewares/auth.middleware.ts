import { Request, Response, NextFunction } from 'express';
import { Token } from '../services/token.service';

export const checkingAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!authHeader) {
            return res.status(401).json({ msg: 'Token não fornecido' });
        }
        if (!token) {
            return res.status(401).json({ msg: 'Token inválido' });
        }

        const payload = new Token().validateToken(token);
        if (!payload || !payload.id) {
            return res.status(401).json({ msg: 'Não autorizado' });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ msg: 'Erro interno no servidor' });
    }
};
