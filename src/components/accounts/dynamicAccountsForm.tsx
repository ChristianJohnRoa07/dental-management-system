"use client";

import React, { useState } from "react";
import { X, User, Mail, Shield } from "lucide-react";

export interface AccountFormData {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  verifiedAt?: string | null;
}

interface DynamicAccountsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AccountFormData) => void;
  initialData?: AccountFormData | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

const DEFAULT_FORM_DATA: AccountFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  role: "Dental Assistant",
  isVerified: false,
  verifiedAt: null,
};

const ROLES = [
  "Lead Dentist",
  "Associate Dentist",
  "Hygienist",
  "Dental Assistant",
  "Receptionist",
  "Practice Manager",
];

export default function DynamicAccountsFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
}: DynamicAccountsFormModalProps) {
  if (!open) return null;

  // Key forces component remount when target account changes, avoiding useEffect setState calls
  const formKey = initialData?.id ?? (isEditMode ? "edit" : "create");

  return (
    <AccountFormContent
      key={formKey}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData}
      isEditMode={isEditMode}
      isViewMode={isViewMode}
    />
  );
}

function AccountFormContent({
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode,
  isViewMode,
}: Omit<DynamicAccountsFormModalProps, "open">) {
  const [formData, setFormData] = useState<AccountFormData>(
    initialData ?? DEFAULT_FORM_DATA
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) {
      onOpenChange(false);
      return;
    }
    onSubmit?.(formData);
    onOpenChange(false);
  };

  const getTitle = () => {
    if (isViewMode) return "User Account Profile";
    if (isEditMode) return "Edit User Account";
    return "Create New Account";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{getTitle()}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isViewMode
                ? "Detailed information for this account"
                : isEditMode
                ? "Update user role and details"
                : "Fill in details to provision a new user account"}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={isViewMode || isEditMode}
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="e.g. Jane"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                disabled={isViewMode || isEditMode}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="e.g. Doe"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                disabled={isViewMode || isEditMode}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="jdoe"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={isViewMode || isEditMode}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="jane@clinic.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                disabled={isViewMode}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isViewMode ? "Close" : "Cancel"}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                {isEditMode ? "Save Changes" : "Create Account"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}