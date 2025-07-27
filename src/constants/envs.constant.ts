const getEnv = (key: string, defaultValue: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not defined.`);
    }
    return value;
};

export const JWT_SECRET = getEnv('JWT_SECRET', 'default_jwt_secret');
export const DATABASE_URL = getEnv('DATABASE_URL', 'postgresql://admin:root@localhost:5432/sghss?schema=vidaplus&connection_limit=5&socket_timeout=3');
export const PORT = getEnv('PORT', '3333');