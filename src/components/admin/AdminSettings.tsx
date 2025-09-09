"use client";

import { useId, useState } from "react";

export function AdminSettings() {
  const [notifications, setNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const siteNameId = useId();
  const siteDescriptionId = useId();
  const notificationsId = useId();
  const maintenanceId = useId();
  const twoFactorId = useId();
  const emailVerificationId = useId();
  const sessionTimeoutId = useId();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-cyberpunk text-neon-orange mb-2">Settings</h1>
        <p className="text-gray-300">Configure system settings and preferences</p>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor={siteNameId} className="block text-sm font-medium text-gray-300 mb-2">
                Site Name
              </label>
              <input
                id={siteNameId}
                type="text"
                placeholder="Enter site name"
                className="w-full px-3 py-2 border border-primary/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-800/50 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor={siteDescriptionId} className="block text-sm font-medium text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                id={siteDescriptionId}
                placeholder="Enter site description"
                rows={3}
                className="w-full px-3 py-2 border border-primary/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-800/50 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={notificationsId} className="text-sm font-medium text-gray-300">
                Enable Notifications
              </label>
              <button
                id={notificationsId}
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={maintenanceId} className="text-sm font-medium text-gray-300">
                Maintenance Mode
              </label>
              <button
                id={maintenanceId}
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  maintenanceMode ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor={twoFactorId} className="text-sm font-medium text-gray-300">
                Two-Factor Authentication
              </label>
              <button
                id={twoFactorId}
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactor ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactor ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={emailVerificationId} className="text-sm font-medium text-gray-300">
                Email Verification
              </label>
              <button
                id={emailVerificationId}
                type="button"
                onClick={() => setEmailVerification(!emailVerification)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailVerification ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailVerification ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={sessionTimeoutId} className="text-sm font-medium text-gray-300">
                Session Timeout
              </label>
              <button
                id={sessionTimeoutId}
                type="button"
                onClick={() => setSessionTimeout(!sessionTimeout)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sessionTimeout ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sessionTimeout ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
