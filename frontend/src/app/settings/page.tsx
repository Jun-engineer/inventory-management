'use client';

import { useEffect, useState } from "react";
import Tabs, { Tab } from "../components/Tabs";

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  // currentPassword is used only for validating profile updates.
  currentPassword?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: "",
    address: "",
    phone: "",
    email: "",
    currentPassword: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [initialTab, setInitialTab] = useState(0);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Fetch company settings on mount.
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings/", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            currentPassword: "", // leave empty; user enters this when updating profile.
          });
        } else {
          console.error("Failed to retrieve settings.");
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    }
    fetchSettings();
  }, []);

  // For profile edit inputs.
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // For password change inputs.
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Save updated profile, which requires currentPassword.
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    try {
      const res = await fetch("/api/settings/update/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setProfileMessage("Profile updated successfully!");
        setSettings(prev => ({ ...prev, currentPassword: "" }));
      } else {
        const errData = await res.json().catch(() => null);
        setProfileMessage(errData?.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      setProfileMessage("An error occurred while updating profile.");
    }
  };

  // Change password.
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }
    try {
      const res = await fetch("/api/settings/password/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });
      if (res.ok) {
        setPasswordMessage("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const errData = await res.json().catch(() => null);
        setPasswordMessage(errData?.error || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password", error);
      setPasswordMessage("An error occurred while changing password.");
    }
  };

  const tabs: Tab[] = [
    {
      label: "Profile",
      content: (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="max-w-md">
            <p><strong>Name:</strong> {settings.name}</p>
            <p><strong>Address:</strong> {settings.address}</p>
            <p><strong>Phone:</strong> {settings.phone}</p>
            <p><strong>Email:</strong> {settings.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Edit Profile",
      content: (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Edit Profile Information</h2>
          <form onSubmit={handleSubmitProfile} className="max-w-md">
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={settings.name}
                onChange={handleEditChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block font-bold mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={settings.address}
                onChange={handleEditChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block font-bold mb-1">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleEditChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleEditChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block font-bold mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleEditChange}
                className="w-full border p-2"
              />
            </div>
            <button type="submit" className="border px-4 py-2 bg-blue-500 text-white">
              Save Profile
            </button>
            {profileMessage && (
              <p className={`mt-4 ${profileMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {profileMessage}
              </p>
            )}
          </form>
        </div>
      ),
    },
    {
      label: "Change Password",
      content: (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleSubmitPassword} className="max-w-md">
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block font-bold mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block font-bold mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-bold mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border p-2"
              />
            </div>
            <button type="submit" className="border px-4 py-2 bg-blue-500 text-white">
              Change Password
            </button>
            {passwordMessage && (
              <p className={`mt-4 ${passwordMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {passwordMessage}
              </p>
            )}
          </form>
        </div>
      ),
    },
  ];

  const tabLabels = ["Profile", "Edit Profile", "Change Password"];

  useEffect(() => {
    const updateTabFromHash = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1).replace(/\/$/, "").trim();
        const index = tabLabels.findIndex((label) => label.toLowerCase() === hash.toLowerCase());
        if (index !== -1) setInitialTab(index);
      }
    };
    updateTabFromHash();
    window.addEventListener("hashchange", updateTabFromHash);
    return () => window.removeEventListener("hashchange", updateTabFromHash);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Settings Page</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}