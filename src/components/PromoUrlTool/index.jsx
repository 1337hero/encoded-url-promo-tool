import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addresses as testAddresses, formData as testFormData } from '@/config/testData';
import { usePromoUrl } from '@/hooks/usePromoUrl';
import React, { useState } from 'react';
import { DecodeForm } from './DecodeForm';
import { GenerateForm } from './GenerateForm';
import { ProfileSelector } from './ProfileSelector';

const INITIAL_FORM_DATA = {
  returnEndDate: '',
  returnPromoCode: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  firstname: '',
  lastname: '',
  email: '',
  validEmail: '',
  phone: '',
  voip: '',
  voipExisting: '',
  serviceName: '',
  numEeros: ''
};

const PromoUrlTool = () => {
  const [url, setUrl] = useState('');
  const [decodedData, setDecodedData] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const { decryptPromoCode, createPromoUrl, error, setError } = usePromoUrl();

  const handleDecode = async () => {
    try {
      setError('');
      const urlObj = new URL(url);
      const encryptedPromo = urlObj.searchParams.get('p');
      
      if (!encryptedPromo) {
        throw new Error('No encrypted promo code found in URL');
      }
      
      const decryptedString = await decryptPromoCode(encryptedPromo);
      const params = new URLSearchParams(decryptedString);
      const decoded = {};
      
      for (const [key, value] of params.entries()) {
        decoded[key] = value;
      }
      
      setDecodedData(decoded);
    } catch (err) {
      setError(err.message);
      setDecodedData(null);
    }
  };

  const handleGenerate = async () => {
    try {
      setError('');
      const url = await createPromoUrl(formData);
      setGeneratedUrl(url);
    } catch (err) {
      setError(err.message);
      setGeneratedUrl('');
    }
  };


  const handleProfileSelect = (type, value) => {
    if (!value) {
      // If "Manual Entry" is selected, do nothing or reset the form
      return;
    }

    const [category, key] = value.split('.');
    
    if (type === 'profile') {
      const profile = testFormData.profiles[category][key];
      setFormData(prev => ({
        ...prev,
        firstname: testFormData._standard.first_name,
        lastname: testFormData._standard.last_name,
        phone: profile.mobile_phone,
        // Map other relevant fields
      }));
    } else if (type === 'address') {
      const address = testAddresses[category][key];
      const [street, city, state, zip] = address.address.split(',').map(s => s.trim());
      setFormData(prev => ({
        ...prev,
        street,
        city,
        state: state.split(' ')[0], // Extract state from "STATE ZIP"
        zip: state.split(' ')[1] || zip, // Use ZIP if provided separately
      }));
    }
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Promotional URL Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="decode">
          <TabsList className="mb-4">
            <TabsTrigger value="decode">Decode URL</TabsTrigger>
            <TabsTrigger value="generate">Generate URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="decode">
            <DecodeForm
              url={url}
              onUrlChange={setUrl}
              onDecode={handleDecode}
              error={error}
              decodedData={decodedData}
            />
          </TabsContent>
          
          <TabsContent value="generate">
            <GenerateForm
              formData={formData}
              onFormChange={handleFormChange}
              onGenerate={handleGenerate}
              error={error}
              generatedUrl={generatedUrl}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromoUrlTool;
