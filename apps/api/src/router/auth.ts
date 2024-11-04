import { Router, Request, Response, NextFunction } from "express";
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from "@repo/db/prisma"

const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secr3t')
}

const authRouter: Router = Router();

const signupPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
  type: z.enum(['admin', 'user'])
})

const signinPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
})


authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = signupPayloadSchema.parse(req.body)

    const user = await prisma.user.findFirst({
      where: {
        username: body.username
      }
    })

    if (!!user) {
      res.status(400).send({ error: 'User already exists' });
      return
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);
    const { id } = await prisma.user.create({
      data: {
        username: body.username,
        password: passwordHash,
        role: body.type
      }
    })
    res.status(200).send({ userId: id });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = signinPayloadSchema.parse(req.body)
    const user = await prisma.user.findFirst({
      where: {
        username: body.username
      }
    })
    if (!user) {
      return res.status(403).send({ error: 'Invalid username' });
    }
    const passwordMatch = bcrypt.compareSync(body.password, user.password);
    if (!passwordMatch) {
      return res.status(403).send({ error: 'Invalid password' });
    }
    const token = generateToken({ id: user.id, username: user.username, type: user.role });
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
});

export default authRouter;
