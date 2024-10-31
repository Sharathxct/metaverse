import { Router, Request, Response } from "express";

const userRouter: Router = Router();

userRouter.get('/metadata', (req: Request, res: Response) => {
  res.send("dummy");
});

userRouter.get('/metadata/bulk', (req: Request, res: Response) => {
  res.send("dummy");
});

export default userRouter;
