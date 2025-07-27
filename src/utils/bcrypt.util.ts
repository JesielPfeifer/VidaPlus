import bcrypt from 'bcrypt';

export const hashPassword = async (
    password: string,
    saltRounds?: number,
): Promise<string> => {
    return await bcrypt.hash(password, saltRounds || 20);
};

export const comparePasswords = async (
    password: string,
    hashedValue: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedValue).catch(() => false);
};
