"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      name: companyName,
      address: address,
      phone: phone,
      email: email,
      password: password,
      status: "active",
    };

    try {
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.error || "Registration failed");
      } else {
        setMessage("Registration successful! Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="flex items-start justify-center bg-white p-6">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-xl p-8">
        <h1 className="text-center text-2xl font-bold mb-6">
          Company Registration
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              id="companyname"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full p-3 rounded-md text-black border"
            />
          </div>
          <div>
            <input
              type="text"
              id="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-3 rounded-md text-black border"
            />
          </div>
          <div>
            <input
              type="text"
              id="phone"
              placeholder="090-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 rounded-md text-black border"
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              placeholder="test@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md text-black border"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-3 rounded-md text-black border"
            />
          </div>
          <div>
            <button
              type="submit"
              id="registerButton"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              Register
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-400 underline">Login here</span>
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link href="/">
            <span className="text-blue-400 underline">Back to Top</span>
          </Link>
        </p>
      </div>
    </div>
  );
}