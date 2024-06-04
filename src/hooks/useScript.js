import { useEffect } from "react";

const useScript = (url, async = true) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = async;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useScript;
