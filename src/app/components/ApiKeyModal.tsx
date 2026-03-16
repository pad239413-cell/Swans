"use client";

import { useState, useEffect } from "react";
import { validateApiKey } from "../lib/helius";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setApiKey("");
      setError("");
      setShowHelp(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        onSave(apiKey);
        onClose();
      } else {
        setError("Invalid API key. Please check and try again.");
      }
    } catch (err) {
      setError("Failed to validate API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card-glossy w-full max-w-md mx-4 p-6 relative" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-green-700 hover:text-green-900"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-1 text-green-900">Enter Helius API Key</h2>
        <p className="text-green-700 text-sm mb-6">
          SwanAI needs a Helius API key to fetch real Solana data
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-green-800 mb-1">
              Helius API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your Helius API key"
              className="w-full rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-green-900 placeholder:text-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="button"
              className="text-green-700 text-sm flex items-center gap-1"
              onClick={() => setShowHelp(!showHelp)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {showHelp ? "Hide Help" : "How to get an API key?"}
            </button>

            {showHelp && (
              <div className="mt-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-100">
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Visit <a href="https://dev.helius.xyz/register" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">dev.helius.xyz/register</a></li>
                  <li>Create a free account</li>
                  <li>Generate a new API key</li>
                  <li>Copy and paste the key here</li>
                </ol>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-green-700 border border-green-300 rounded-lg hover:bg-green-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isValidating}
              className="btn-primary text-sm !py-2 !px-5 flex items-center"
            >
              {isValidating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </>
              ) : (
                "Save API Key"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}