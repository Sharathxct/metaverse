import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function exceptionaHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    return res.status(400).send({ error: err.errors })
  }
  console.log(err)
  const message = err instanceof Error ? err.message : 'Something went wrong'
  res.status(500).send({ message });
}
