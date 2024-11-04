import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function protectedRoute(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).send({ message: "Unauthorized" });
  }
}

export function protectedAdminRoute(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    if (decoded?.type !== "admin") {
      return res.status(403).send({ message: "Unauthorized" });
    }
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).send({ message: "Unauthorized" });
  }
}

