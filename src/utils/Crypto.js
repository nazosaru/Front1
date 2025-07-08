import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY;
if (!SECRET_KEY) {
    throw new Error('Encryption key is not configured');
}

export function encryptData(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptPassword(password) {
    const encrypted = encryptData(password);
    console.log('[Encryption Debug] Original:', password, 'Encrypted:', encrypted);
    return encrypted;
}
