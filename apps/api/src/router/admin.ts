import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@repo/db/prisma";
import { z } from "zod";
import { protectedAdminRoute } from "../middlewares/auth";

const adminRouter: Router = Router();

const elementPayloadSchema = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean()
})

adminRouter.post('/element', protectedAdminRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = elementPayloadSchema.parse(req.body);

    const element = await prisma.element.create({
      data: {
        imageUrl: body.imageUrl,
        width: body.width,
        height: body.height,
        static: body.static
      }
    })
    res.send({ id: element.id })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

const updateElementPayloadSchema = z.object({
  imageUrl: z.string(),
})

adminRouter.put('/element/:elementId', protectedAdminRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateElementPayloadSchema.parse(req.body);

    const element = await prisma.element.update({
      where: {
        id: req.params.elementId
      },
      data: {
        imageUrl: body.imageUrl,
      }
    })
    res.send({ message: "Element updated" })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

const avatarPayloadSchema = z.object({
  imageUrl: z.string(),
  name: z.string()
})

adminRouter.post('/avatar', protectedAdminRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = avatarPayloadSchema.parse(req.body);
    const avatar = await prisma.avatar.create({
      data: {
        imageUrl: body.imageUrl,
        name: body.name
      }
    })
    res.send({ avatarId: avatar.id })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

const mapPayloadSchema = z.object({
  name: z.string(),
  thumbnail: z.string(),
  // regex for 100x200
  dimensions: z.string().regex(/^(5[0-9]|1[0-9]{2}|200)x(5[0-9]|1[0-9]{2}|200)$/),
  defaultElements: z.array(z.object({
    elementId: z.string(),
    x: z.number(),
    y: z.number()
  }))
})

adminRouter.post('/map', protectedAdminRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    //     {
    //    "thumbnail": "https://thumbnail.com/a.png",
    //    "dimensions": "100x200",
    //    "defaultElements": [{
    //        elementId: "chair1",
    //        x: 20,
    //        y: 20
    //      }, {
    //        elementId: "chair2",
    //        x: 18,
    //        y: 20
    //      }, {
    //        elementId: "table1",
    //        x: 19,
    //        y: 20
    //      }, {
    //        elementId: "table2",
    //        x: 19,
    //        y: 20
    //      }
    //    ]
    // }

    const body = mapPayloadSchema.parse(req.body);
    const map = await prisma.map.create({
      data: {
        width: parseInt(body.dimensions.split('x')[0]),
        height: parseInt(body.dimensions.split('x')[1]),
        thumbnail: body.thumbnail,
        name: body.name,
        element: {
          createMany: {
            data: body.defaultElements
          }
        }
      }
    })
    res.send({ id: map.id })
  } catch (err) {
    console.log(err)
    next(err);
  }
})

export default adminRouter
