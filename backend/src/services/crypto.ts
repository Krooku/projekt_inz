import crypto from 'crypto'

interface HashOptions {
  salt?: string
  rounds?: number
}

/**
 * Hash password using PBKDF2
 * @returns Hash string
 */
export async function hashPassword (password: string, options: HashOptions = {}) {
  return new Promise<string>((resolve, reject) => {
    options.salt = options.salt || crypto.randomBytes(16).toString('base64')
    options.rounds = options.rounds || 1000

    crypto.pbkdf2(password, options.salt, options.rounds, 64, 'sha512', (err, hash) => {
      if (err) reject(err)

      resolve([
        hash.toString('base64'),
        options.salt,
        options.rounds
      ].join('|'))
    })
  })
}

/**
 * Compares password with a hash
 * @param trial Tested password
 * @param hashedString Hashed string
 */
export async function validatePassword (trial: string, hashedString: string) {
  const hashed = hashedString.split('|')
  if (hashed.length !== 3) return false
  const hashedTrial = await hashPassword(trial, {
    salt: hashed[1],
    rounds: parseInt(hashed[2])
  })
  return hashedTrial === hashedString
}
