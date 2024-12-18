export const stringToUint8Array = (str) => new TextEncoder().encode(str);

export const uint8ArrayToHex = (uint8Array) => {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const hexToUint8Array = (hexString) => {
  const matches = hexString.match(/.{1,2}/g);
  return matches ? new Uint8Array(matches.map((byte) => parseInt(byte, 16))) : new Uint8Array(0);
};

export const getCryptoKey = async (key) => {
  const keyData = hexToUint8Array(key);
  return window.crypto.subtle.importKey("raw", keyData, { name: "AES-CBC" }, false, [
    "encrypt",
    "decrypt",
  ]);
};
