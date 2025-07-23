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
            res.status(401).json({ msg: 'Token não fornecido' });
            return;
        }
        if (!token) {
            res.status(401).json({ msg: 'Token inválido' });
            return;
        }

        const payload = new Token().validateToken(token);
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
