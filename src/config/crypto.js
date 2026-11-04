import crypto from 'node:crypto';
import 'dotenv/config';

const keyHex = process.env.SESSION_ENCRYPTION_KEY;

if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
  throw new Error(
    'SESSION_ENCRYPTION_KEY debe contener exactamente 64 caracteres hexadecimales.'
  );
}

const key = Buffer.from(keyHex, 'hex');

export function encryptToken(token) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex')
  ].join('.');
}

export function decryptToken(encryptedToken) {
  const [ivHex, authTagHex, encryptedHex] = encryptedToken.split('.');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Formato de token cifrado inválido.');
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}
