import z from 'zod';

const EmailSchema = z.string().email().min(1).max(255);
const PasswordSchema = z.string().min(6).max(255);
const NameSchema = z.string().min(1).max(255);
const RoleSchema = z.enum(['Administrador', 'Profissional', 'Cliente']);

export const LoginSchema = z.object({
    nome: NameSchema,
    email: EmailSchema,
    senha: PasswordSchema,
});

export const RegisterSchema = LoginSchema.extend({
    perfil: RoleSchema,
    confirmaSenha: PasswordSchema,
}).refine((data) => data.senha === data.confirmaSenha, {
    message: 'Passwords do not match',
    path: ['confirmaSenha'],
});
