import React, { useState } from 'react';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';

export default function BrokerConnect({ onSyncSuccess }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const onSuccess = async (public_token, metadata) => {
    setIsSyncing(true);
    try {
      // Send the token to the backend to perform the live sync
      // Using query parameters since the FastAPI endpoint uses `access_token: str`
      const response = await axios.post(`/api/brokerage/sync?access_token=${public_token}`);
      
      // Pass the fully enriched portfolio (health score, risk radar, etc.) up to the app
      if (onSyncSuccess) {
        onSyncSuccess(response.data);
      }
    } catch (err) {
      console.error("Brokerage sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const config = {
    token: 'LINK_TOKEN_GENERATED_BY_BACKEND',
    onSuccess,
    // env: 'sandbox',
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button 
      onClick={() => open()} 
      disabled={!ready || isSyncing}
      className="px-4 py-2 bg-blue-600 text-white font-mono uppercase text-[10px] tracking-widest"
    >
      {isSyncing ? "Syncing Holdings..." : "Connect Live Broker"}
    </button>
  );
}
