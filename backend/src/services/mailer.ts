import nodemailer from 'nodemailer'
import config from '../config'
import jwt from 'jsonwebtoken'

type TokenType = 'verify' | 'reset' | 'change'

export interface TokenObject {
  t: 'v' | 'r' | 'c'
  e: string
}

const transporter = nodemailer.createTransport(config.mailConfig)

function getVerifyEmailTemplate (username: string, confirmUrl: string) {
  return `Cześć ${username}, potwierdź swój adres e-mail klikając w link poniżej:
<br><a href="${confirmUrl}">Potwierdź adres e-mail</a>`
}

function getChangeEmailTemplate (username: string, newEmail: string, changeUrl: string) {
  return `Cześć ${username}, dostaliśmy prośbę o zmianę Twojego e-maila na <b>${newEmail}</b>
<br><a href="${changeUrl}">Potwierdź zmianę</a>`
}

function getPasswordResetTemplate (username: string, resetUrl: string) {
  return `Cześć ${username}, dostaliśmy prośbę o zresetowanie hasła do Twojego konta.
<br>Jeśli ta prośba nie pochodzi od Ciebie, zignoruj tę wiadomość.
<br><a href="${resetUrl}">Zresetuj hasło</a>`
}

/**
 * Generates JWT token
 */
async function generateToken (type: TokenType, email: string, addon?: any) {
  return new Promise((resolve) => {
    let tokenType
    if (type === 'verify') tokenType = 'v'
    else if (type === 'reset') tokenType = 'r'
    else if (type === 'change') tokenType = 'c'
    if (!tokenType) throw new Error('Unknown token type')

    const obj = {
      t: tokenType,
      e: email
    }

    Object.assign(obj, addon)

    jwt.sign(obj, config.cookieSecret, {
      expiresIn: '15m',
      noTimestamp: true
    }, (e, token) => {
      resolve(token)
    })
  })
}

export async function sendVerificationEmail (username: string, email: string) {
  const token = await generateToken('verify', email)

  const confirmUrl = `${config.backendUrl}/api/user/verify/${token}`

  transporter.sendMail({
    from: config.mailSender,
    to: email,
    subject: 'Potwierdź adres e-mail',
    html: getVerifyEmailTemplate(username, confirmUrl)
  })
}

export async function sendChangeEmail (username: string, email: string, newEmail: string) {
  const token = await generateToken('change', email, {
    newEmail
  })
  const changeUrl = `${config.frontendUrl}/api/user/changeEmail/${token}`

  transporter.sendMail({
    from: config.mailSender,
    to: email,
    subject: 'Zmiana adresu e-mail',
    html: getChangeEmailTemplate(username, newEmail, changeUrl)
  })
}

export async function sendPasswordResetEmail (username: string, email: string) {
  const token = await generateToken('reset', email)
  const resetUrl = `${config.frontendUrl}/api/user/resetPassword/${token}`

  transporter.sendMail({
    from: config.mailSender,
    to: email,
    subject: 'Resetowanie hasła',
    html: getPasswordResetTemplate(username, resetUrl)
  })
}
