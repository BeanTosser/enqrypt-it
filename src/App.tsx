import "./Style/input.css";
import React, { useEffect, useState, useRef } from "react";

import StringEncryptorDecryptor from "./Tools/StringEncryptorDecryptor";
import { EncryptedData } from "./Tools/StringEncryptorDecryptor";

import QRCode from 'qrcode';

import qrcodeParser from "qrcode-parser";

export default function App() {
  const encryptorDecryptor = new StringEncryptorDecryptor();

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
    //keyPair.current = data.encryptionKey;
    setEncryptedPassword(data.encryptedString);
    setDecryptedPassword("");
    console.log("Password successfully encrypted: " + data);
    let qrImage = await QRCode.toDataURL(data.encryptedString);
    setQrcodeImage(qrImage);
  }
  
  const decryptPassword = async function () {
    let decodedQr = qrcodeParser(qrcodeImage);
    
    
    
    
    let decodedQrArrayBuffer = encoder.encode(decodedQr);
    
    
    
    
    let decryptedPassword: string = (await encryptorDecryptor.decryptArrayBuffer(decodedQr as ArrayBuffer));
    let decryptedPasswordString
    setEncryptedPassword(null);
    //setDecryptedPassword(decryptedPassword);
  }
  
  let encryptButton: JSX.Element;
  let decryptButton: JSX.Element;
  
  if(encryptedPassword === null) {
    encryptButton = 
      <>
        <button
          onClick={encryptPassword}
        >
          Encrypt
        </button>
      </>
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
    </div>
  );
}
