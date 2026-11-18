import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

export const ITERATIONS = 600000;

export function seal(plain, phrase) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(phrase, salt, ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  try {
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final(), cipher.getAuthTag()]);
    return { version: 1, kdf: 'PBKDF2', hash: 'SHA-256', iterations: ITERATIONS, cipher: 'AES-GCM', salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };
  } finally {
    key.fill(0);
  }
}

export function unseal(payload, phrase) {
  if (payload.version !== 1 || payload.kdf !== 'PBKDF2' || payload.hash !== 'SHA-256' || payload.iterations !== ITERATIONS || payload.cipher !== 'AES-GCM') throw new Error('Unsupported course payload.');
  const salt = Buffer.from(payload.salt, 'base64');
  const iv = Buffer.from(payload.iv, 'base64');
  const sealed = Buffer.from(payload.ct, 'base64');
  if (salt.length !== 16 || iv.length !== 12 || sealed.length <= 16) throw new Error('Invalid course payload.');
  const key = pbkdf2Sync(phrase, salt, ITERATIONS, 32, 'sha256');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  try {
    decipher.setAuthTag(sealed.subarray(-16));
    return Buffer.concat([decipher.update(sealed.subarray(0, -16)), decipher.final()]).toString('utf8');
  } finally {
    key.fill(0);
  }
}
