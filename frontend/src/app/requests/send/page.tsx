'use client';

import { useState } from "react";

export default function SendRequest() {
  const [sellerEmail, setSellerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seller_email: sellerEmail }),
      });
      if (res.ok) {
        setMessage("Request sent successfully.");
        setSellerEmail("");
      } else {
        const errData = await res.json();
        setMessage(errData.error || "Failed to send request.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Send Permission Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Enter Seller&apos;s Email:</label>
          <input
            type="email"
            value={sellerEmail}
            onChange={(e) => setSellerEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "Sending..." : "Send Request"}
        </button>
      </form>
      {message && <p className={`mt-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
    </div>
  );
}