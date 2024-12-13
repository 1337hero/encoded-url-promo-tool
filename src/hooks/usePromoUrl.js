import { getCryptoKey, hexToUint8Array, stringToUint8Array, uint8ArrayToHex } from '@/lib/crypto';
import { useState } from 'react';

export const usePromoUrl = () => {
  const [error, setError] = useState('');
  
  const decryptPromoCode = async (encryptedText) => {
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    try {
      const [ivHex, encryptedDataHex] = encryptedText.split(':');
      const iv = hexToUint8Array(ivHex);
      const encryptedData = hexToUint8Array(encryptedDataHex);
      const cryptoKey = await getCryptoKey(key);
      
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        encryptedData
      );
      
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      throw new Error('Failed to decrypt promo code');
    }
  };

  const createPromoUrl = async (promoData) => {
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    try {
      const params = new URLSearchParams();
      Object.entries(promoData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const cryptoKey = await getCryptoKey(key);
      const dataToEncrypt = stringToUint8Array(params.toString());
      
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        dataToEncrypt
      );
      
      const encryptedHex = uint8ArrayToHex(new Uint8Array(encryptedData));
      const ivHex = uint8ArrayToHex(iv);
      
      return `${window.location.origin}?p=${ivHex}:${encryptedHex}`;
    } catch (error) {
      throw new Error('Failed to create promo URL');
    }
  };

  return {
    decryptPromoCode,
    createPromoUrl,
    error,
    setError
  };
};