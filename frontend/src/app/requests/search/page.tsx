'use client';

import { useState } from "react";

type PermissionRequest = {
  ID: number;
  requester_email: string;
  requester_phone: string;
  status: string;
};

export default function PermissionSearch() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<PermissionRequest[]>([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (email) queryParams.append("email", email);
      if (phone) queryParams.append("phone", phone);

      const res = await fetch(
        `/api/requests/search?${queryParams.toString()}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setMessage("Search error.");
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
        {results.length === 0 ? (
          <p>No matching permission requests.</p>
        ) : (
          <ul>
            {results.map((req, index) => (
              <li key={req.ID || index} className="border p-2 mt-2">
                <p>Email: {req.requester_email}</p>
                <p>Phone: {req.requester_phone}</p>
                <p>Status: {req.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}