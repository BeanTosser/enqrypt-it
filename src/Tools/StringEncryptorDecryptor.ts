/*
 * This script simplifieds the process of encoding and decoding strings with javascript's built-in 
 * encryption features (crypto.subtle). Crypto.subtle can't directly encrypt or decrypt strings; they must first be converted
 * to (for encryption) or from (after decryption) ArrayBuffers. 
 */
 
let debug_originalArrayBuffer: ArrayBuffer;
 
export type EncryptedData = {
  encryptedBuffer: ArrayBuffer,
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
  
  constructor(notifyKeyGeneratedCallback?: () => void){
    this.encryptionKey = null;
    if(notifyKeyGeneratedCallback){
      this.generateKey(notifyKeyGeneratedCallback);
    } else {
      this.generateKey();
    }
    
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
  
  async generateKey(callBack?: () => void) {
    this.encryptionKey = await subtleCrypto.generateKey(keyConfig, true, ["encrypt", "decrypt"]);
    if(callBack !== null && callBack !== undefined){
      callBack();
    }
  }
  
  async encryptArrayBuffer(buffer: ArrayBuffer, key?: CryptoKey): Promise<EncryptedData | null>{
    let selectedKey: CryptoKey;
    if(key !== undefined){
      selectedKey = key;
    } else if(this.encryptionKey !== null){
      selectedKey = this.encryptionKey.publicKey as CryptoKey;
    } else {
      throw new Error("Encryption key has not finished generating.");
    }
    
    // Encrypt the message
    let encryptedMessage: ArrayBuffer;
    try{
      encryptedMessage = await subtleCrypto.encrypt(encryptionParams, selectedKey, buffer);
    } catch(e){
      throw e;
    }
    const encryptedMessageString = this.decoder.decode(encryptedMessage);
    return {
      encryptedBuffer: encryptedMessage,
      encryptedString: encryptedMessageString,
      encryptionKey: key as CryptoKey
    };
  }
  
  async encryptString(str: string, key?: CryptoKey): Promise<EncryptedData | null>{
    const encodedString = this.encoder.encode(str);
    return await this.encryptArrayBuffer(encodedString, key); 
  }
  
  async decryptString(str: string, key?: CryptoKey){
    let encodedStr = this.encoder.encode(str);
    console.log("encodedStr: " + encodedStr.toString());
    
    if(key !== undefined && key !== null) {
      return this.decryptArrayBuffer(encodedStr, key);
    } else {
      return this.decryptArrayBuffer(encodedStr);
    }
  }
  
  async decryptArrayBuffer(arrayBufferMessage: Uint8Array, key?: CryptoKey): Promise<string | undefined>{
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
    let decryptedMessageString: string;
    if(this.encryptionKey !== null){

      try{
        decryptedMessage = await subtleCrypto.decrypt(encryptionParams, selectedKey, arrayBufferMessage);

      } catch(e) {
        console.log("Failed to decrypt QR: " + e);
        return;
      }
      try{

        decryptedMessageString = this.decoder.decode(decryptedMessage);
      } catch(e) {
        console.log("Failed to decode ArrayBuffer: " + e);
        return;
      }

      return decryptedMessageString;
    } else {
      throw new Error("Encryption key has not finished generating!");
    }
  }
}
 
export default StringEncryptorDecryptor;