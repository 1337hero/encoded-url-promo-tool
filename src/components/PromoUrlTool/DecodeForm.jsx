import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

export const DecodeForm = ({ url, onUrlChange, onDecode, error, decodedData }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="url">Enter Promotional URL</Label>
      <Input
        id="url"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com?p=..."
        className="w-full"
      />
    </div>
    <Button onClick={onDecode}>Decode URL</Button>
    {error && <div className="text-red-500 mt-2">{error}</div>}
    {decodedData && (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Decoded Parameters:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(decodedData, null, 2)}
        </pre>
      </div>
    )}
  </div>
);