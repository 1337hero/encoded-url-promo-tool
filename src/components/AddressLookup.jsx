import { Input } from "@/components/ui/Input";
import { extractAddress, initGoogleMapsApi } from "@/services/googleMaps";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AddressLookup = ({ onAddressSelect }) => {
  // State Management
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const inputRef = useRef(null);

  // Service Initialization
  useEffect(() => {
    let mounted = true;

    const initializeGoogleMaps = async () => {
      try {
        await initGoogleMapsApi();
        if (!mounted) return;

        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        const dummyElement = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(dummyElement);

        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to initialize address lookup");
        setIsLoading(false);
      }
    };

    initializeGoogleMaps();
    return () => {
      mounted = false;
    };
  }, []);

  // Place Details Handler
  const getPlaceDetails = useCallback((placeId) => {
    return new Promise((resolve, reject) => {
      if (!placesService.current) {
        reject(new Error("Places service not initialized"));
        return;
      }

      placesService.current.getDetails(
        {
          placeId,
          fields: ["address_components"],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(new Error("Failed to fetch place details"));
          }
        }
      );
    });
  }, []);

  // Address Processing
  const extractAddressComponents = useCallback((place) => {
    const componentMap = {
      street_number: "street_number",
      route: "street_name",
      locality: "city",
      administrative_area_level_1: "state",
      postal_code: "zip",
    };

    const address = {
      street: "",
      city: "",
      state: "",
      zip: "",
    };

    place.address_components.forEach((component) => {
      const type = component.types[0];
      if (componentMap[type]) {
        if (type === "street_number") {
          address.street = component.long_name;
        } else if (type === "route") {
          address.street += " " + component.long_name;
        } else if (componentMap[type] === "city") {
          address.city = component.long_name;
        } else if (componentMap[type] === "state") {
          address.state = component.short_name;
        } else if (componentMap[type] === "zip") {
          address.zip = component.long_name;
        }
      }
    });

    return address;
  }, []);

  // Event Handlers
  const handleSelectPrediction = useCallback(
    async (prediction) => {
      if (!prediction) return;

      try {
        const placeDetails = await getPlaceDetails(prediction.place_id);
        const address = extractAddressComponents(placeDetails);

        if (inputRef.current) {
          inputRef.current.value = prediction.description;
        }

        setPredictions([]);
        onAddressSelect(address);
      } catch (error) {
        console.error("Error fetching place details:", error);
        setError("Failed to get complete address details");
      }
    },
    [getPlaceDetails, extractAddressComponents, onAddressSelect]
  );

  const fetchPredictions = useCallback((input) => {
    if (!input || !autocompleteService.current) return;

    const request = {
      input,
      types: ["address"],
      componentRestrictions: { country: "us" },
    };

    autocompleteService.current.getPlacePredictions(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPredictions(results);
      } else {
        setPredictions([]);
      }
    });
  }, []);

  const debouncedFetchPredictions = useMemo(
    () => debounce((value) => fetchPredictions(value), 300),
    [fetchPredictions]
  );

  const handleInputChange = useCallback(
    (e) => {
      debouncedFetchPredictions(e.target.value);
    },
    [debouncedFetchPredictions]
  );

  // 7. Render Methods
  if (isLoading) {
    return <div className="text-gray-500">Loading address service...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        onChange={handleInputChange}
        placeholder="Start typing your address..."
        className="w-full"
      />
      {predictions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSelectPrediction(prediction)}>
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressLookup;
