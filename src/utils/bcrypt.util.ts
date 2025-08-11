import bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds?: number) =>
    bcrypt.hash(password, saltRounds || 10);

export const comparePasswords = async (
    password: string,
    hashedValue: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedValue).catch(() => false);
};
