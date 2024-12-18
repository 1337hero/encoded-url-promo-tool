import AddressLookup from "@/components/AddressLookup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import React, { useCallback, useMemo } from "react";

// Constants
const TEST_DATA = {
  firstname: "Testing",
  lastname: "API",
  phone: "555-555-555",
  email: "apitestingo7@techguys.co",
};

const SERVICE_OPTIONS = [
  { value: "SURF 8 Gig", label: "SURF 8 Gig" },
  { value: "SURF 2 Gig", label: "SURF 2 Gig" },
  { value: "SURF 1 Gig", label: "SURF 1 Gig" },
  { value: "SURF 500", label: "SURF 500" },
];

const TIME_OPTIONS = [
  { value: "30min", label: "30 Minutes", minutes: 30 },
  { value: "24hr", label: "24 Hours", minutes: 24 * 60 },
  { value: "1week", label: "1 Week", minutes: 7 * 24 * 60 },
];

const FIELD_GROUPS = {
  address: ["street", "city", "state", "zip"],
  contact: ["firstname", "lastname", "email", "phone"],
  promo: ["returnPromoCode", "numEeros"], // Removed returnEndDate as it's now handled separately
};

const GenerateForm = ({ formData, onFormChange, onGenerate, error, generatedUrl }) => {
  // Event Handlers
  const handleAddressSelect = useCallback(
    (address) => {
      const updates = {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
      };
      Object.entries(updates).forEach(([key, value]) => {
        onFormChange({ target: { name: key, value } });
      });
    },
    [onFormChange]
  );

  const handlePrepopulate = useCallback(
    (e, fieldName) => {
      onFormChange({
        target: {
          name: fieldName,
          value: e.target.checked ? TEST_DATA[fieldName] : "",
        },
      });
    },
    [onFormChange]
  );

  const handleServiceSelect = useCallback(
    (value) => {
      onFormChange({
        target: {
          name: "serviceName",
          value: value || "",
        },
      });
    },
    [onFormChange]
  );

  const handleTimeSelect = useCallback(
    (value) => {
      const selectedOption = TIME_OPTIONS.find(option => option.value === value);
      if (selectedOption) {
        const futureDate = new Date(Date.now() + selectedOption.minutes * 60 * 1000);
        onFormChange({
          target: {
            name: "returnEndDate",
            value: futureDate.getTime().toString(),
          },
        });
      }
    },
    [onFormChange]
  );

  // Render Methods
  const renderContactField = useCallback(
    (key) => (
      <div key={key} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={key}>{key}</Label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`prepopulate-${key}`}
              onChange={(e) => handlePrepopulate(e, key)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={`prepopulate-${key}`} className="text-sm text-gray-500">
              Prepopulate
            </Label>
          </div>
        </div>
        <Input
          id={key}
          name={key}
          value={formData[key]}
          onChange={onFormChange}
          placeholder={key}
        />
      </div>
    ),
    [formData, onFormChange, handlePrepopulate]
  );

  const renderFields = useCallback(
    (fields) =>
      fields.map((key) => (
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
      )),
    [formData, onFormChange]
  );

  const renderServiceSelect = useMemo(
    () => (
      <div>
        <Label htmlFor="serviceName">serviceName</Label>
        <Select value={formData.serviceName || undefined} onValueChange={handleServiceSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service..." />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    [formData.serviceName, handleServiceSelect]
  );

  const renderTimeSelect = useMemo(
    () => (
      <div>
        <Label htmlFor="returnEndDate">Return End Date</Label>
        <Select 
          value={TIME_OPTIONS.find(opt => 
            formData.returnEndDate === new Date(Date.now() + opt.minutes * 60 * 1000).getTime().toString()
          )?.value} 
          onValueChange={handleTimeSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select expiration time..." />
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.returnEndDate && (
          <div className="mt-1 text-sm text-gray-500">
            Expires: {new Date(parseInt(formData.returnEndDate)).toLocaleString()}
          </div>
        )}
      </div>
    ),
    [formData.returnEndDate, handleTimeSelect]
  );

  // Return/Render
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>
        <AddressLookup onAddressSelect={handleAddressSelect} />
        <div className="grid grid-cols-2 gap-4">{renderFields(FIELD_GROUPS.address)}</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">{FIELD_GROUPS.contact.map(renderContactField)}</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Promotional Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderServiceSelect}
          {renderTimeSelect}
          {renderFields(FIELD_GROUPS.promo)}
        </div>
      </div>

      <Button onClick={onGenerate}>Generate URL</Button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      {generatedUrl && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Generated URL:</h3>
          <div className="break-all rounded bg-gray-100 p-4">{generatedUrl}</div>
        </div>
      )}
    </div>
  );
};

export default GenerateForm;