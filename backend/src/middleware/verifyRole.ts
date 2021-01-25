import { Request, Response, NextFunction } from 'express'

type UserRole = 'guest' | 'member' | 'admin'

export default (userRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
  const session = req.session
  if (!session) {
    return res.status(403).end()
  }

  const loggedIn = session.user

  const userRole = !loggedIn ? 'guest' : session.user.role

  if (!userRoles.some(role => role === userRole)) {
    return res.status(403).end()
  }

  next()
}
