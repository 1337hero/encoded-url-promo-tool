let isLoading = false;
let isLoaded = false;
let loadingPromise = null;

const waitForGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);
        resolve();
      } else if (count > 100) {
        // 10 seconds timeout
        clearInterval(interval);
        reject(new Error("Google Maps initialization timeout"));
      }
      count++;
    }, 100);
  });
};

export const initGoogleMapsApi = () => {
  if (isLoaded && window.google && window.google.maps) {
    return Promise.resolve();
  }

  if (isLoading && loadingPromise) {
    return loadingPromise;
  }

  isLoading = true;

  loadingPromise = new Promise((resolve, reject) => {
    try {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        waitForGoogleMaps()
          .then(() => {
            isLoaded = true;
            isLoading = false;
            resolve();
          })
          .catch(reject);
        return;
      }

      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initMap`;

      // Define callback
      window.initMap = () => {
        waitForGoogleMaps()
          .then(() => {
            isLoaded = true;
            isLoading = false;
            resolve();
          })
          .catch(reject);
      };

      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      reject(error);
    }
  });

  return loadingPromise;
};

export const extractAddress = (prediction) => {
  if (!prediction || !prediction.terms) {
    console.log("Invalid prediction object:", prediction);
    return null;
  }

  const terms = prediction.terms;
  const addressComponents = {
    street: "",
    city: "",
    state: "",
    zip: "",
  };

  if (terms.length >= 1) {
    addressComponents.street = terms[0].value;
  }
  if (terms.length >= 3) {
    addressComponents.city = terms[1].value;
    addressComponents.state = terms[2].value;
  }
  if (terms.length >= 4) {
    addressComponents.zip = terms[3].value;
  }

  return addressComponents;
};
