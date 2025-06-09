import jwt from 'jsonwebtoken';

export class Token {
    private static SECRET = process.env.SECRET || 'minha-chave-secreta';

    public createToken = (req: any): string => {
        return jwt.sign(req, Token.SECRET, {
            expiresIn: '1h',
        });
    };

    public validateToken = (token: string): any => {
        try {
            return jwt.verify(token, Token.SECRET);
        } catch (error) {
            return null;
        }
    };
}
