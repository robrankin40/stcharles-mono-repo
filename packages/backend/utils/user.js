import crypto from 'crypto';

export const generatePassword = (
  length = 12,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('')

export const sanitizeEmail = email => {
  if (typeof email !== 'string') return email;
  return email.trim().toLowerCase();
}
