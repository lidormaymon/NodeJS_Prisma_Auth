import { NextFunction, Request, Response } from "express"
import { BadRequestsException } from "../exceptions/bad-request"
import { ErrorCode } from "../exceptions/root"
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets"
import { prismaClient } from ".."
import { User } from "@prisma/client"


const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
        return next(new BadRequestsException('UnauthorizedNoToken', ErrorCode.UNAUTHORIZED))
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as User
        const user = await prismaClient.user.findFirst({ where: { id: payload.id } })
        if (!user) {
            return next(new BadRequestsException('UnauthorizedNNotVeified', ErrorCode.UNAUTHORIZED))
        }
        req.user = user
        next()
    } catch (error) {
        return next(new BadRequestsException('UnauthorizedError', ErrorCode.UNAUTHORIZED))
    }
}


export default authMiddleware