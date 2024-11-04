import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { protectedRoute } from "../middlewares/auth";
import { prisma } from "@repo/db/prisma";

const spaceRouter: Router = Router();

const spacePayloadSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^(5[0-9]|1[0-9]{2}|200)x(5[0-9]|1[0-9]{2}|200)$/),
  mapId: z.string().optional(),
})

spaceRouter.post('/', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("by passed the auth middleware jhagsdjhfgajshdhfhjagjshdfhjagsdhjfgahjsdgfjhagsdjhfgakjhsdgfjhasdfhgajhsdfgjhagsdfhgajhsdgfjhagsdfhjgasjhdgfjhasgdfhjgasdhjfghjsdgfjhgasdhjfgahjsdgfhjgasdjhfgajhsdgfhjdsfhgsdjhfgjhsdf");
    const body = spacePayloadSchema.parse(req.body);

    let space;
    if (!body.mapId) {
      space = await prisma.space.create({
        data: {
          name: body.name,
          width: parseInt(body.dimensions.split('x')[0]),
          height: parseInt(body.dimensions.split('x')[1]),
          userId: req.user.id,
        }
      })
      console.log("No map id");
    } else {

      const map = await prisma.map.findFirst({
        where: {
          id: body.mapId
        },
        include: {
          element: true
        }
      })
      if (!map) {
        return res.status(400).send({ error: 'Map not found' });
      }

      space = await prisma.$transaction(async () => {
        const space = await prisma.space.create({
          data: {
            name: body.name,
            thumbnail: map.thumbnail,
            width: parseInt(body.dimensions.split('x')[0]),
            height: parseInt(body.dimensions.split('x')[1]),
            userId: req.user.id,
          }
        })
        await prisma.spaceElement.createMany({
          data: map.element.map(element => {
            return {
              spaceId: space.id,
              elementId: element.elementId,
              x: element.x,
              y: element.y
            }
          })
        })

        return space;
      })

    }
    res.send({ spaceId: space.id })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

const deleteElementPayloadSchema = z.object({
  id: z.string(),
})

spaceRouter.delete('/element', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const body = deleteElementPayloadSchema.parse(req.body);

    await prisma.spaceElement.delete({
      where: {
        id: body.id
      }
    })
    res.send({ message: 'deleted' })
  } catch (err) {
    console.log(err)
    next(err);
  }
})


spaceRouter.delete('/:spaceId', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spaceId = req.params.spaceId;

    const space = await prisma.space.findFirst({
      where: {
        id: spaceId
      },
      include: {
        elements: true
      }
    })
    if (!space) {
      return res.status(400).send({ error: 'Space not found' });
    }

    if (space.userId !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    await prisma.space.delete({
      where: {
        id: spaceId
      },
      include: {
        elements: true
      }
    })

    res.send({ message: 'deleted' })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

spaceRouter.get('/all', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spaces = await prisma.space.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        elements: true
      }
    })
    res.send({ spaces })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

spaceRouter.get('/:spaceId', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spaceId = req.params.spaceId;

    const space = await prisma.space.findFirst({
      where: {
        id: spaceId
      },
      include: {
        elements: true
      }
    })
    if (!space) {
      return res.status(400).send({ error: 'Space not found' });
    }

    if (space.userId !== req.user.id) {
      return res.status(400).send({ error: 'Unauthorized' });
    }

    res.send({
      spaceId: space.id,
      name: space.name,
      thumbnail: space.thumbnail,
      dimensions: `${space.width}x${space.height}`,
      elements: space.elements
    })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

const elementPayloadSchema = z.object({
  elementId: z.string(),
  spaceId: z.string(),
  x: z.number(),
  y: z.number()
})

spaceRouter.post('/element', protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = elementPayloadSchema.parse(req.body);

    const space = await prisma.space.findFirst({
      where: {
        id: body.spaceId
      }
    })
    if (!space) {
      return res.status(400).send({ error: 'Space not found' });
    }

    if (body.x > space.width || body.y > space.height) {
      return res.status(400).send({ error: 'Invalid position' });
    }

    if (space.userId !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    const element = await prisma.spaceElement.create({
      data: {
        elementId: body.elementId,
        spaceId: body.spaceId,
        x: body.x,
        y: body.y
      }
    })
    res.send({ id: element.id })
  } catch (err) {
    console.log(err)
    next(err);
  }
})


export default spaceRouter;
