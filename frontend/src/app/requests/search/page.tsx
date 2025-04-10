'use client';

import { useState } from "react";

interface PermissionRequest {
  ID: number;
  requester_email: string;
  requester_phone: string;
  status: string;
}

export default function PermissionSearch() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<PermissionRequest[]>([]);
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    try {
      setSearched(true);
      const queryParams = new URLSearchParams();
      if (email) queryParams.append("email", email);
      if (phone) queryParams.append("phone", phone);

      const res = await fetch(`/api/requests/search?${queryParams.toString()}/`, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setMessage("Search error.");
    }
  };

  const handlePermit = async (requestId: number) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "permitted" }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.error || "Update failed.");
        return;
      }
      setMessage("Request permitted successfully.");
      // Update local state
      setResults(prev =>
        prev.map(r => r.ID === requestId ? { ...r, status: "permitted" } : r)
      );
      // Reload page after 3 seconds.
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Search Permission Requests</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      <div className="mt-4">
        {searched && results.length === 0 ? (
          <p>No matching permission requests.</p>
        ) : (
          <ul>
            {results.map((req, index) => (
              <li key={req.ID || index} className="border p-2 mt-2">
                <p>Email: {req.requester_email}</p>
                <p>Phone: {req.requester_phone}</p>
                <p>Status: {req.status}</p>
                {req.status === "pending" && (
                  <button
                    onClick={() => handlePermit(req.ID)}
                    className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                  >
                    Permit Request
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}