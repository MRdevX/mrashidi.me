"use client";

import { useId, useState } from "react";
import { AdminPageLayout } from "./AdminPageLayout";

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
    <AdminPageLayout title="Settings" description="Configure system settings and preferences">
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
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <input
                  id={notificationsId}
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    notifications ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={maintenanceId} className="text-sm font-medium text-gray-300">
                Maintenance Mode
              </label>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <input
                  id={maintenanceId}
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={() => setMaintenanceMode(!maintenanceMode)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    maintenanceMode ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      maintenanceMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </div>
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
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <input
                  id={twoFactorId}
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    twoFactor ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactor ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={emailVerificationId} className="text-sm font-medium text-gray-300">
                Email Verification
              </label>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <input
                  id={emailVerificationId}
                  type="checkbox"
                  checked={emailVerification}
                  onChange={() => setEmailVerification(!emailVerification)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    emailVerification ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailVerification ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={sessionTimeoutId} className="text-sm font-medium text-gray-300">
                Session Timeout
              </label>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <input
                  id={sessionTimeoutId}
                  type="checkbox"
                  checked={sessionTimeout}
                  onChange={() => setSessionTimeout(!sessionTimeout)}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    sessionTimeout ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sessionTimeout ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </div>
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
    </AdminPageLayout>
  );
}
