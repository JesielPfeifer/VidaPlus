import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import logger from '../lib/logger';

export const checkingAuth = (cargo: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validator = new TokenService();

        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1];

            if (!authHeader) {
                logger.error('Token não fornecido');
                res.status(401).json({ msg: 'Token não fornecido' });
                return;
            }
            if (!token) {
                logger.error('Token inválido');
                res.status(401).json({ msg: 'Token inválido' });
                return;
            }

            const payload = validator.validateToken(token);
            if (
                !payload ||
                !payload.id ||
                !payload.cargo ||
                !cargo.includes(payload.cargo)
            ) {
                logger.error('Usuário não autorizado');
                res.status(401).json({ msg: 'Não autorizado' });
                return;
            }
            next();
        } catch (error: any) {
            logger.error(`Erro ao validar token: ${error.message}`);
            res.status(500).json({ msg: 'Erro interno no servidor' });
            return;
        }
    };
};
