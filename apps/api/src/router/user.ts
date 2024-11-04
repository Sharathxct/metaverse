import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@repo/db/prisma";
import { z } from 'zod'
import { protectedRoute } from "../middlewares/auth";

const userPayloadSchema = z.object({
  avatarId: z.string()
})

const userRouter: Router = Router();

userRouter.post('/metadata', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = userPayloadSchema.parse(req.body);

    const avatar = await prisma.avatar.findFirst({
      where: {
        id: body.avatarId
      }
    });

    if (!avatar) {
      console.log('Avatar ID invalid', avatar);
      return res.status(400).send({ error: 'Avatar ID invalid' });
    }

    await prisma.user.update({
      where: {
        //@ts-ignore
        username: req.user.username
      },
      data: {
        avatar: {
          connect: {
            id: body.avatarId
          }
        }
      }
    });

    console.log('Success');

    res.status(200).send({ message: 'Success' });
  } catch (err) {
    console.log(err)
    next(err)
  }
});

userRouter.get('/metadata/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const ids: string = req.query.ids
    const userIds = ids ? ids.replace(/^\[|\]$/g, '').split(',').map(id => id.trim()) : [];

    if (userIds.length === 0) {
      return res.status(400).send({ error: 'No user IDs provided' });
    }

    const usersWithAvatars = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      include: {
        avatar: true,
      },
    });

    const avatars = usersWithAvatars.map(user => ({
      userId: user.id,
      imageUrl: user.avatar?.imageUrl || null,
    }));

    return res.status(200).send({ avatars });
  } catch (err) {
    next(err);
  }
});

export default userRouter;
