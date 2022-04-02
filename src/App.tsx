import "./Style/input.css";
import React, { useEffect, useRef } from "react";

export default function App() {

  const keyParams = 

  const subtleCrypto = window.crypto.subtle;
  
  useEffect(() => {
    const createKey = async function(){
      keyPair.current = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );
    }
  }, [])

  const enteredPassword = useRef<string>("");
  const keyPair = useRef<CryptoKeyPair | null>(null);

  const handlePasswordChange = function (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    enteredPassword.current = event.target.value;
    console.log("password changed");
  };

  const submitPassword = function (){

  }

  return (
    <div className="App">
      <input
        type="text"
        className="text_entry password_entry"
        onChange={handlePasswordChange}
      />
      <button
        onClick={submitPassword}
    </div>
  );
}
