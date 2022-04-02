/*
 * This script simplifieds the process of encoding and decoding strings with javascript's built-in 
 * encryption features (crypto.subtle). Crypto.subtle can't directly encrypt or decrypt strings; they must first be converted
 * to (for encryption) or from (after decryption) ArrayBuffers. 
 */
 
const subtleCrypto = window.crypto.subtle;
const keyConfig = {
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1,0,1]),
  hash: "SHA-256"
}
const encryptionParams = {
  name: "RSA-OAEP"
}
class StringEncryptorDecryptor {
  encoder: TextEncoder;
  decoder: TextDecoder;
  encryptionKey: CryptoKeyPair | null;
  
  constructor(encryptionKey: CryptoKeyPair){
    if(encryptionKey === null || encryptionKey === undefined){
      this.encryptionKey = null;
      this.generateKey();
    } else {
      this.encryptionKey = encryptionKey;
    }
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
  
  async generateKey(){
    this.encryptionKey = await subtleCrypto.generateKey(keyConfig, true, ["encrypt", "decrypt"]);
  }
  
  async encryptString(str: string){
    const unencryptedMessage = this.encoder.encode(str);
  
    // Encrypt the message
    let encryptedMessage;
    try {
      encryptedMessage = await subtleCrypto.encrypt(encryptionParams, this.encryptionKey.publicKey, unencryptedMessage);
    } catch(e) {
      console.log("Error encrypting message: " + e);
      return null;
    }
    return encryptedMessage;
  }
}
 
 export default StringEncryptorDecryptor;