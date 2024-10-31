import { Router, Request, Response } from "express";
import { z } from 'zod'

const authRouter: Router = Router();

const signupPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
})

authRouter.get('/signup', (req: Request, res: Response) => {
  res.send("dummy");
});

authRouter.get('/signin', (req: Request, res: Response) => {
  res.send("dummy");
});

export default authRouter;
