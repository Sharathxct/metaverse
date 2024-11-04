import { Router, Request, Response, NextFunction } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import spaceRouter from "./space";
import adminRouter from "./admin";
import { prisma } from "@repo/db/prisma";
const router: Router = Router();

router.use(authRouter);
router.use('/user', userRouter);
router.use('/space', spaceRouter)
router.use('/admin', adminRouter)

router.get("/elements", async (_req: Request, res: Response, next: NextFunction) => {
  // Get all elements
  try {
    const elements = await prisma.element.findMany();
    res.send(elements)
  } catch (err) {
    console.log(err)
    next(err);
  }
});

router.get("/avatars", async (_req: Request, res: Response, next: NextFunction) => {
  // Get all avatars
  try {
    const avatars = await prisma.avatar.findMany();
    res.send({ avatars })
  } catch (err) {
    console.log(err)
    next(err);
  }
});


export default router;
