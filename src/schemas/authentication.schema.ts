import z from 'zod';

const EmailSchema = z.string().email().min(1).max(255);
const PasswordSchema = z.string().min(6).max(255);
const NameSchema = z.string().min(1).max(255);
const UserAgentSchema = z.string().optional();

export const LoginSchema = z.object({
    nome: NameSchema,
    email: EmailSchema,
    senha: PasswordSchema,
});

export const RegisterSchema = LoginSchema.extend({
    confirmPassword: PasswordSchema,
}).refine((data) => data.senha === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
