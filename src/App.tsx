import "./Style/input.css";
import React, { useEffect, useState, useRef } from "react";

import StringEncryptorDecryptor from "./Tools/StringEncryptorDecryptor";
import { EncryptedData } from "./Tools/StringEncryptorDecryptor";

import QRCode from 'qrcode';

import qrcodeParser from "qrcode-parser";

export default function App() {
  const [isKeyGenerated, setIsKeyGenerated] = useState<boolean>(false);
  
  const notifyKeyGenerated: () => void = function(){
    setIsKeyGenerated(true);
  }
  
  const encryptorDecryptor = new StringEncryptorDecryptor(notifyKeyGenerated);

  const enteredPassword = useRef<string>("");
  const [encryptedPassword, setEncryptedPassword] = useState<string | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string>("");
  const [qrcodeImage, setQrcodeImage] = useState<string>("");
  
  const keyPair = useRef<CryptoKeyPair | null>(null);

  const handlePasswordChange = function (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    enteredPassword.current = event.target.value;
    console.log("password changed");
  };

  const encryptPassword = async function (){
    let data: EncryptedData;
    try{
      data = (await encryptorDecryptor.encryptString(enteredPassword.current)) as EncryptedData;
    } catch(e) {
      console.log("Failed to encrypt data: " + e);
      return;
    }
    console.log("encrypted buffer: " + data.encryptedBuffer);
    //keyPair.current = data.encryptionKey;
    setEncryptedPassword(data.encryptedString);
    setDecryptedPassword("");
    console.log("Password successfully encrypted: " + data.encryptedString);
    let qrImage = await QRCode.toDataURL(data.encryptedString);
    setQrcodeImage(qrImage);
  }
  
  const decryptPassword = async function () {
    let decodedQr: string = await qrcodeParser(qrcodeImage);
    console.log("decoded QR: " + decodedQr);
    let decryptedPassword: string = await encryptorDecryptor.decryptString(decodedQr) as string;
    
    setEncryptedPassword(null);
    setDecryptedPassword(decryptedPassword);
  }
  
  let encryptButton: JSX.Element;
  let decryptButton: JSX.Element;
  
  if(encryptedPassword === null) {
    if(isKeyGenerated){
      encryptButton = 
        <>
          <button
            onClick={encryptPassword}
          >
            Encrypt
          </button>
        </>
    } else {
      encryptButton = 
        <>
          <button
            onClick={encryptPassword}
            disabled
          >
            Encrypt
          </button>
        </>
    }
    decryptButton = 
      <>
        <button
          onClick={decryptPassword}
          disabled
        >
         Decrypt
        </button>
      </>
  } else {
    encryptButton = 
      <>
        <button
          onClick={encryptPassword}
          disabled
        >
          Encrypt
        </button>
      </>
    decryptButton = 
      <>
        <button
          onClick={decryptPassword}
        >
         Decrypt
        </button>
      </>
  }
  return (
    <div className="App">
      <h1>{decryptedPassword}</h1>
      <input
        type="text"
        className="text_entry password_entry"
        onChange={handlePasswordChange}
      />
      {encryptButton}
      {decryptButton}
      <img src={qrcodeImage} alt="qrcode"/>
      <p>Decrypted Password: {decryptedPassword}</p>
    </div>
  );
}
