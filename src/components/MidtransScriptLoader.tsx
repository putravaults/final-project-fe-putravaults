'use client'

import { useEffect, useState } from 'react';

export default function MidtransScriptLoader() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (typeof window.snap !== 'undefined') {
      setScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="midtrans"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (typeof window.snap !== 'undefined') {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Manually load the script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    
    script.onload = () => {
      // Wait a bit for initialization
      setTimeout(() => {
        if (typeof window.snap !== 'undefined') {
          setScriptLoaded(true);
        }
      }, 500);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
