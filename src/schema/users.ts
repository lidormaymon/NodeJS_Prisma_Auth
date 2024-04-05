import { z } from 'zod'

export const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})