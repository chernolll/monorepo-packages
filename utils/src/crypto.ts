import CryptoJS from "crypto-js";

export class Crypto<T extends object> {

  constructor(public secret: string) {
  }

  encrypt(data: T): string {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret);
    return encrypted.toString();
  }

  decrypt(encrypted: string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret);
    const dataString = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(dataString) as T;
    } catch {
      return null;
    }
  }
}