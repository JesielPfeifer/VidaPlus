import { prisma } from '../lib/prisma';
import { comparePasswords } from '../utils/bcrypt.util';

export class AdminService {
    constructor() {}

    public async getAdminByEmail(email: string) {
        const admin = await prisma.usuario_admin.findUnique({
            where: { email },
            omit: { senha: true },
        });
        return admin ? admin : null;
    }
    public async isValidPassword(email: string, password: string) {
        const admin = await prisma.usuario_admin.findUnique({
            where: { email },
        });
        if (!admin) return false;

        const isValid = await comparePasswords(password, admin.senha);
        return isValid;
    }

    public async createAdmin(data: any) {
        return await prisma.usuario_admin.create({ data });
    }

    public async updateAdmin(id: string, data: any) {
        return await prisma.usuario_admin.update({ where: { id }, data });
    }

    public async deleteAdmin(id: string) {
        return await prisma.usuario_admin.delete({
            where: { id },
        });
    }

    public async existsAdmin(id: string) {
        const admin = await prisma.usuario_admin.findUnique({
            where: { id },
        });
        return !!admin;
    }
}
