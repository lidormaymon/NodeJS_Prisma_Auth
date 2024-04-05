import { Response, Request, NextFunction } from 'express'
import { prismaClient } from '..'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { BadRequestsException } from '../exceptions/bad-request'
import { ErrorCode } from '../exceptions/root'
import { loginSchema, signUpSchema } from '../schema/users'


export const signUp = async (req: Request, res: Response, next: NextFunction)  => {
    signUpSchema.parse(req.body) // Must do the validation before anything else
    const { email, password, username } = req.body
    const existingUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    })

    if (existingUser) {   
        if (existingUser.username === username) {
            return next(new BadRequestsException('Username already exists!', ErrorCode.USER_ALREADY_EXIST))
        } else if (existingUser.email === email) {
            return next(new BadRequestsException('Email already exists!', ErrorCode.USER_ALREADY_EXIST))
        }
    }

    const newUser = await prismaClient.user.create({
        data: {
            username,
            email,
            password: hashSync(password, 10)
        }
    })

    res.json(newUser)
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    loginSchema.parse(req.body)
    const { username, password } = req.body
    const user = await prismaClient.user.findFirst({ where: { username } })

    if (user) {
        if (!compareSync(password, user.password)) {
            return next(new BadRequestsException('Username or password are wrong', ErrorCode.UNAUTHORIZED))
        }
    } else {
        return next(new BadRequestsException('Username or password are wrong', ErrorCode.UNAUTHORIZED))
    }
    const token = jwt.sign({
        id: user?.id,
        username: user?.username,
        email: user?.email
    }, JWT_SECRET)

    res.json({ user, token })
}

export const me = async ( req:Request, res:Response ) => {
    res.json(req.user)
}

