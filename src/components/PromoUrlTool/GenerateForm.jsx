import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export const GenerateForm = ({
  formData,
  onFormChange,
  onGenerate,
  error,
  generatedUrl,
}) => {

  return (
    <div className="space-y-4">
            <div className="w-full rounded-md border border-input bg-background px-4 py-6 grid grid-cols-2 gap-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span>phone: "555-555-5555"</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>first_name: "API"</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>last_name: "TESTING o7"</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>email: bobby@techguys.com</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <span>425 Houston St, Ottawa, IL 61350</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              name={key}
              value={formData[key]}
              onChange={onFormChange}
              placeholder={key}
            />
          </div>
        ))}
      </div>
      <Button onClick={onGenerate}>Generate URL</Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {generatedUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated URL:</h3>
          <div className="bg-gray-100 p-4 rounded break-all">
            {generatedUrl}
          </div>
        </div>
      )}
    </div>
  );
};
