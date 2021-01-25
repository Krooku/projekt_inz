import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.user) {
    return res.status(401).end()
  }

  next()
}
