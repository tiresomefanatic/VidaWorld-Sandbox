import CryptoJS from "crypto-js";
import EncryptRsa from "encrypt-rsa";
import appUtils from "./appUtils";

export const cryptoUtils = {
  cryptoPublicKey: appUtils.getConfig("cryptoPublicKey"),
  encrypt(msg) {
    return CryptoJS.AES.encrypt(msg, this.cryptoPublicKey);
  },

  decrypt(encryptedMsg) {
    const bytes = CryptoJS.AES.decrypt(encryptedMsg, this.cryptoPublicKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

export const RSAUtils = {
  isEncryptionSupportRequired: appUtils.getConfig(
    "isEncryptionSupportRequired"
  ),
  RSAPublicKey: appUtils.getConfig("RSAPublicKey"),
  encrypt(param) {
    if (this.isEncryptionSupportRequired) {
      const encryptRsa = new EncryptRsa();
      const text = typeof param === "object" ? JSON.stringify(param) : param;
      const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({
        text,
        publicKey: this.RSAPublicKey
      });
      return encryptedText;
    } else {
      return param;
    }
  }
};
export const RSAUtilsAccessories = {
  RSAPublicKey: appUtils.getConfig("RSAPublicKey"),
  encrypt(param) {
    const encryptRsa = new EncryptRsa();
    const text = typeof param === "object" ? JSON.stringify(param) : param;
    const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({
      text,
      publicKey: this.RSAPublicKey
    });
    return encryptedText;
  }
};
