import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;

export function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
}

export function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}
