import jwt from 'jsonwebtoken'
import { User } from '../models'
import { sendPasswordResetEmail, sendVerificationEmail, TokenObject, sendChangeEmail } from '../services/mailer'
import config from '../config'
import { validatePassword } from '../services/crypto'
import { Request, Response } from 'express'

/*
 * Error Codes:
 *  0 - IncompleteRequest
 *  1 - InvalidEmail
 *  2 - AlreadyUsed
 */
export async function register (req: Request, res: Response) {
  const { username, email, password } = req.body

  // check required parameters
  if (!username || !password || !email) {
    return res.status(400).json({
      errorCode: 0,
      message: 'Niepełne zapytanie'
    })
  }

  // validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Email musi być poprawny'
    })
  }

  const user = new User({ email, username, password })

  try {
    await user.save()
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        errorCode: 2,
        message: 'Ta nazwa użytkownika lub email są już używane'
      })
    }

    return res.status(500).json({
      message: 'Database error',
      error: error
    })
  }

  if (!config.skipEmailVerification) {
    sendVerificationEmail(username, email)
  }

  res.status(200).end()
}

/*
 * Error Codes:
 *  0 - InvalidPassword
 *  1 - UserDoesNotExist
 *  2 - EmailNotVerified
 */
export async function login (req: Request, res: Response) {
  if (!req.session) {
    return res.status(500).json({
      message: 'Creating session failed'
    })
  }

  if (req.session.user) {
    req.session.user = null
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const user = await User.findOne({ username }).exec()

  if (!user) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Użytkownik nie istnieje'
    })
  }

  const validated = await validatePassword(password, user.password)

  if (!validated) {
    return res.status(400).json({
      errorCode: 0,
      message: 'Zła nazwa użytkownika lub hasło'
    })
  }

  if (!user.isVerified && !config.skipEmailVerification) {
    return res.status(400).json({
      errorCode: 2,
      message: 'Email nie jest zweryfikowany'
    })
  }

  req.session.user = {
    id: user._id,
    role: user.role
  }

  const userObj = {
    ...req.session.user,
    username: user.username,
    email: user.email,
  }

  return res.status(200).json(userObj)
}

export function logout (req: Request, res: Response) {
  if (req.session) req.session.destroy(() => {})
  res.status(200).end()
}

export async function getUser (req: Request, res: Response) {
  // TODO: Sanitize user object
  if (!req.session) return res.status(500).end()

  const user = await User.findById(req.session.user.id)
  if (!user) return res.status(500).end()
  
  const userObj = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  }

  res.status(200).json(userObj)
}

export async function updateUsername (req: Request, res: Response) {
  const { username } = req.body
  if (!req.session) return res.status(500).end()

  try {
    await User.updateOne({
      _id: req.session.user.id
    }, {
      username
    }).exec()
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'This username is already used'
      })
    }

    return res.status(500).json({
      message: 'Could not change username'
    })
  }

  res.status(200).end()
}

export async function updateEmail (req: Request, res: Response) {
  const { password, email } = req.body
  if (!req.session) return res.status(500).end()

  if (!email || !password) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const user = await User.findById(req.session.user.id).exec()
  if (!user) {
    return res.status(500).end()
  }

  if (!(password && await validatePassword(password, user.password))) {
    return res.status(401).json({
      message: 'Błędne hasło'
    })
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Email musi być poprawny'
    })
  }

  sendChangeEmail(user.username, user.email, email)

  res.status(200).end()
}

export async function updatePassword (req: Request, res: Response) {
  const { currentPassword, password } = req.body
  if (!req.session) return res.status(500).end()

  if (!currentPassword || !password) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const user = await User.findById(req.session.user.id).exec()
  if (!user) {
    return res.status(500).end()
  }

  if (!(await validatePassword(currentPassword, user.password))) {
    return res.status(401).json({
      message: 'Invalid password'
    })
  }

  user.password = password

  try {
    await user.save()
  } catch (err) {
    res.status(500).json({
      message: 'Could not update password'
    })
  }

  res.status(200).end()
}

export async function verifyEmail (req: Request, res: Response) {
  const { token } = req.params

  if (!token) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const decoded = jwt.verify(token, config.cookieSecret)

  const decodedToken = decoded as TokenObject

  if (decodedToken.t !== 'v') {
    return res.status(400).json({
      message: 'Błędny klucz'
    })
  }

  const email = decodedToken.e

  try {
    const user = await User.findOneAndUpdate({
      email: email
    }, {
      isVerified: true
    }).exec()

    if (!user) {
      return res.status(400).json({
        message: 'Nie można zweryfikować'
      })
    }

    res.redirect(config.frontendUrl)
  } catch (err) {
    return res.status(500).end()
  }
}

export async function changeEmail (req: Request, res: Response) {
  const { token } = req.params

  if (!token) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const decoded = jwt.verify(token, config.cookieSecret)

  const decodedToken = decoded as any

  if (decodedToken.t !== 'c') {
    return res.status(400).json({
      message: 'Błędny klucz'
    })
  }

  const { e: email, newEmail } = decodedToken

  try {
    const user = await User.updateOne({
      email
    }, {
      email: newEmail
    }).exec()

    if (!user) {
      return res.status(400).json({
        message: 'Nie można zweryfikować'
      })
    }

    res.redirect(config.frontendUrl)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Ten email jest już używany'
      })
    }

    return res.status(500).json({
      message: 'Nie można zmienić emaila'
    })
  }
}

export async function sendReset (req: Request, res: Response) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const user = await User.findOne({ email })

  if (!user || !user.isVerified) {
    return res.status(200).end()
  }

  sendPasswordResetEmail(user.username, email)

  res.status(200).end()
}

export async function resetPassword (req: Request, res: Response) {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const decoded = jwt.verify(token, config.cookieSecret)
  const decodedToken = decoded as TokenObject

  if (decodedToken.t !== 'r') {
    return res.status(400).json({
      message: 'Błędny klucz'
    })
  }

  const email = decodedToken.e

  try {
    const user = await User.findOneAndUpdate({ email }, { password }).exec()

    if (!user) {
      return res.status(400).json({
        message: 'Nie można zweryfikować'
      })
    }

    res.status(200).end()
  } catch (err) {
    return res.status(500).end()
  }
}

function validateEmail (email: string) {
  const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegexp.test(email)
}
