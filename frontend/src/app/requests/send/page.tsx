'use client';

import { useState } from "react";

export default function SendRequest() {
  const [sellerEmail, setSellerEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seller_email: sellerEmail }),
      });
      if (res.ok) {
        setMessage("Request sent successfully.");
      } else {
        const errData = await res.json();
        setMessage(errData.error || "Failed to send request.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Send Permission Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Enter Seller's Email:</label>
          <input
            type="email"
            value={sellerEmail}
            onChange={(e) => setSellerEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Send Request
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}