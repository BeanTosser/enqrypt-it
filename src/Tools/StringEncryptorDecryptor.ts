/*
 * This script simplifieds the process of encoding and decoding strings with javascript's built-in 
 * encryption features (crypto.subtle). Crypto.subtle can't directly encrypt or decrypt strings; they must first be converted
 * to (for encryption) or from (after decryption) ArrayBuffers. 
 */
 
export type EncryptedData = {
  encryptedString: string,
  encryptionKey: CryptoKey
}
 
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
  
  constructor(encryptionKey?: CryptoKeyPair){
    if(encryptionKey === null || encryptionKey === undefined){
      this.encryptionKey = null;
      this.generateKey();
    } else {
      this.encryptionKey = encryptionKey;
    }
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
  
  async generateKey() {
    this.encryptionKey = await subtleCrypto.generateKey(keyConfig, true, ["encrypt", "decrypt"]);
  }
  
  async encryptString(str: string, key?: CryptoKey): Promise<EncryptedData | null>{
    let selectedKey: CryptoKey;
    if(key !== undefined){
      selectedKey = key;
    } else if(this.encryptionKey !== null){
      selectedKey = this.encryptionKey.publicKey as CryptoKey;
    } else {
      throw new Error("Encryption key has not finished generating.");
    }

    const unencryptedMessage = this.encoder.encode(str);
    
    // Encrypt the message
    let encryptedMessage: ArrayBuffer;
    try{
      encryptedMessage = await subtleCrypto.encrypt(encryptionParams, selectedKey, unencryptedMessage);
    } catch(e){
      throw e;
    }
    const encryptedMessageString = this.decoder.decode(encryptedMessage);
    return {encryptedString: encryptedMessageString, encryptionKey: key as CryptoKey};
  }
  
  async decryptArrayBuffer(arrayBufferMessage: ArrayBuffer, key?: CryptoKey): Promise<string>{
    let selectedKey: CryptoKey;
    if(key !== undefined){
      selectedKey = key;
    } else if(this.encryptionKey !== null){
      selectedKey = this.encryptionKey.privateKey as CryptoKey;
    } else {
      throw new Error("Encryption key has not finished generating.");
    }
    // Decrypt the message into ArrayBuffer
    let decryptedMessage: ArrayBuffer;
    if(this.encryptionKey !== null){
      decryptedMessage = await subtleCrypto.decrypt(encryptionParams, selectedKey, arrayBufferMessage);
      let decryptedMessageString = this.decoder.decode(decryptedMessage);
      return decryptedMessageString;
    } else {
      throw new Error("Encryption key has not finished generating!");
    }
  }
}
 
export default StringEncryptorDecryptor;