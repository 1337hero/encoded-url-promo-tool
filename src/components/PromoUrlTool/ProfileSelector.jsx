// src/components/PromoUrlTool/ProfileSelector.jsx
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addresses, formData } from '@/config/testData';
import React from 'react';

export const ProfileSelector = ({ onSelect }) => {
  const formatAddress = (address) => {
    if (!address) return '';
    const [street, ...rest] = address.split(',');
    return street.trim();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Profile Template</Label>
          <Select onValueChange={(value) => onSelect('profile', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select profile..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              {Object.entries(formData.profiles).map(([category, profiles]) => 
                Object.entries(profiles).map(([key, profile]) => (
                  <SelectItem key={`${category}-${key}`} value={`${category}.${key}`}>
                    {profile.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Address Template</Label>
          <Select onValueChange={(value) => onSelect('address', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select address..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              {Object.entries(addresses).map(([category, categoryAddresses]) => {
                if (category === 'residential') {
                  return Object.entries(categoryAddresses).map(([key, addr]) => (
                    <SelectItem key={`${category}-${key}`} value={`${category}.${key}`}>
                      {addr.label} - {formatAddress(addr.address)}
                    </SelectItem>
                  ));
                }
                if (category === 'promos') {
                  return Object.entries(categoryAddresses).map(([key, addr]) => (
                    <SelectItem key={`${category}-${key}`} value={`${category}.${key}`}>
                      {addr.label} - {formatAddress(addr.address)}
                    </SelectItem>
                  ));
                }
                return null;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};