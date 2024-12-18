import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import React from "react";

const DecodeForm = ({ url, onUrlChange, onDecode, error, decodedData }) => (
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
    {error && <div className="mt-2 text-red-500">{error}</div>}
    {decodedData && (
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Decoded Parameters:</h3>
        <pre className="overflow-auto rounded bg-gray-100 p-4">
          {JSON.stringify(decodedData, null, 2)}
        </pre>
      </div>
    )}
  </div>
);

export default DecodeForm;
