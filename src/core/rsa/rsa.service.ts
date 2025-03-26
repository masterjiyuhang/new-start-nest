import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';

@Injectable()
export class RsaService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = readFileSync(
      join(__dirname, './key/private.pem'),
      'utf8',
    );
    this.publicKey = readFileSync(join(__dirname, './key/public.pem'), 'utf8');
  }

  // 1. 获取公钥（提供给前端）
  getPublicKey(): string {
    return this.publicKey;
  }

  // 2. 解密前端传来的加密数据
  decryptData(encryptedText: string): string {
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'SHA256',
      },
      buffer,
    );
    return decrypted.toString('utf8');
  }
}
