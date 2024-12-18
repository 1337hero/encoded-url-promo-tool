import DecodeForm from "@/components/PromoDecodeForm";
import GenerateForm from "@/components/PromoGenerateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { usePromoUrl } from "@/hooks/usePromoUrl";
import { useCallback, useMemo, useState } from "react";

// Constants

const INITIAL_FORM_DATA = {
  returnEndDate: "",
  returnPromoCode: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  firstname: "",
  lastname: "",
  email: "",
  validEmail: "",
  phone: "",
  voip: "",
  voipExisting: "",
  serviceName: "",
  numEeros: "",
};

const PromoUrlTool = () => {
  const [state, setState] = useState({
    decode: {
      url: "",
      decodedData: null,
    },
    generate: {
      formData: INITIAL_FORM_DATA,
      generatedUrl: "",
    },
  });
  const [activeTab, setActiveTab] = useState("decode");

  // 2. Custom Hooks
  const { decryptPromoCode, createPromoUrl, error, setError } = usePromoUrl();

  // 3. Event Handlers
  const handleUrlChange = useCallback((newUrl) => {
    setState((prev) => ({
      ...prev,
      decode: { ...prev.decode, url: newUrl },
    }));
  }, []);

  const handleFormChange = useCallback((e) => {
    setState((prev) => ({
      ...prev,
      generate: {
        ...prev.generate,
        formData: {
          ...prev.generate.formData,
          [e.target.name]: e.target.value,
        },
      },
    }));
  }, []);

  const handleTabChange = useCallback(
    (value) => {
      setActiveTab(value);
      setError("");
    },
    [setError]
  );

  // 4. Complex Operation Handlers
  const handleDecode = useCallback(async () => {
    try {
      setError("");
      const urlObj = new URL(state.decode.url);
      const encryptedPromo = urlObj.searchParams.get("p");

      if (!encryptedPromo) {
        throw new Error("No encrypted promo code found in URL");
      }

      const decryptedString = await decryptPromoCode(encryptedPromo);
      const decoded = Object.fromEntries(new URLSearchParams(decryptedString));

      setState((prev) => ({
        ...prev,
        decode: { ...prev.decode, decodedData: decoded },
      }));
    } catch (err) {
      setError(err.message);
      setState((prev) => ({
        ...prev,
        decode: { ...prev.decode, decodedData: null },
      }));
    }
  }, [state.decode.url, decryptPromoCode, setError]);

  const handleGenerate = useCallback(async () => {
    try {
      setError("");
      const url = await createPromoUrl(state.generate.formData);
      setState((prev) => ({
        ...prev,
        generate: { ...prev.generate, generatedUrl: url },
      }));
    } catch (err) {
      setError(err.message);
      setState((prev) => ({
        ...prev,
        generate: { ...prev.generate, generatedUrl: "" },
      }));
    }
  }, [state.generate.formData, createPromoUrl, setError]);

  // 5. Memoized Props
  const decodeFormProps = useMemo(
    () => ({
      url: state.decode.url,
      onUrlChange: handleUrlChange,
      onDecode: handleDecode,
      error,
      decodedData: state.decode.decodedData,
    }),
    [state.decode, error, handleUrlChange, handleDecode]
  );

  const generateFormProps = useMemo(
    () => ({
      formData: state.generate.formData,
      onFormChange: handleFormChange,
      onGenerate: handleGenerate,
      error,
      generatedUrl: state.generate.generatedUrl,
    }),
    [state.generate, error, handleFormChange, handleGenerate]
  );

  // 6. Render
  return (
    <Card className="mx-auto mt-20 w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Promotional URL Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="decode" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="decode">Decode URL</TabsTrigger>
            <TabsTrigger value="generate">Generate URL</TabsTrigger>
          </TabsList>
          <TabsContent value="decode">
            <DecodeForm {...decodeFormProps} />
          </TabsContent>
          <TabsContent value="generate">
            <GenerateForm {...generateFormProps} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromoUrlTool;
