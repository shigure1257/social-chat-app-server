import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';

export function decryptPassword(password: string) {
  const buffer = Buffer.from(password, 'base64');
  const privateKey = process.env.PRIVKEY_KEY;
  const plain = crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer,
    )
    .toString('utf-8');
  return plain;
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plain, salt);
  return hashedPassword;
}

export function Md5Hash(file: Express.Multer.File) {
  const md5Alg = crypto.createHash('md5');
  md5Alg.update(file.buffer);
  const res = md5Alg.digest('hex');
  return res;
}
