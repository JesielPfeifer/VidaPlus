import { prisma } from '../lib/prisma';

export class AdminService {
    constructor() {}

    public async getAdminByEmail(email: string) {
        const admin = await prisma.usuario_admin.findUnique({
            where: { email },
        });
        return admin ? admin : null;
    }

    public async createAdmin(data: any) {
        return await prisma.usuario_admin.create({
            data,
            omit: { senha: true },
        });
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
