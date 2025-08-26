'use client'

import { useEffect, useState } from 'react';

export default function MidtransDebug() {
  const [debugInfo, setDebugInfo] = useState({
    scriptLoaded: false,
    snapAvailable: false,
    clientKey: '',
    windowSnap: false,
  });

  useEffect(() => {
    const checkMidtransStatus = () => {
      setDebugInfo({
        scriptLoaded: typeof window !== 'undefined' && !!document.querySelector('script[src*="midtrans"]'),
        snapAvailable: typeof window !== 'undefined' && typeof window.snap !== 'undefined',
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'NOT_SET',
        windowSnap: typeof window !== 'undefined' && !!window.snap,
      });
    };

    // Check immediately
    checkMidtransStatus();

    // Check again after a delay to see if script loads
    const timer = setTimeout(checkMidtransStatus, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Midtrans Debug Info</h3>
      <div className="space-y-1">
        <div>Script Loaded: {debugInfo.scriptLoaded ? '✅' : '❌'}</div>
        <div>Snap Available: {debugInfo.snapAvailable ? '✅' : '❌'}</div>
        <div>Window Snap: {debugInfo.windowSnap ? '✅' : '❌'}</div>
        <div>Client Key: {debugInfo.clientKey ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}
