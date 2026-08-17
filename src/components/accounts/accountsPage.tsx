"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  Users,
  Search,
  FileEdit,
  FileText,
  CheckCircle2,
  XCircle,
  Shield,
  Calendar,
  Mail,
  User as UserIcon,
  UserX,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import DynamicAccountsFormModal, { AccountFormData } from "@/components/accounts/dynamicAccountsForm";

export interface AccountRecord {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  verifiedAt: string | null;
}

const INITIAL_ACCOUNTS: AccountRecord[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Jenkins",
    username: "sjenkins",
    email: "sarah.j@clinic.com",
    role: "Lead Dentist",
    isVerified: true,
    verifiedAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chang",
    username: "mchang",
    email: "m.chang@clinic.com",
    role: "Hygienist",
    isVerified: true,
    verifiedAt: "2024-02-10",
  },
  {
    id: "3",
    firstName: "Elena",
    lastName: "Rostova",
    username: "erostova",
    email: "elena.r@clinic.com",
    role: "Receptionist",
    isVerified: false,
    verifiedAt: null,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Miller",
    username: "dmiller",
    email: "d.miller@clinic.com",
    role: "Dental Assistant",
    isVerified: true,
    verifiedAt: "2024-03-01",
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountRecord[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string>("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountRecord | null>(null);
  const [viewingAccount, setViewingAccount] = useState<AccountRecord | null>(null);

  // CRUD Handlers
  const handleCreateAccount = (formData: AccountFormData) => {
    const newAccount: AccountRecord = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      isVerified: formData.isVerified,
      verifiedAt: formData.isVerified
        ? formData.verifiedAt || new Date().toISOString().split("T")[0]
        : null,
    };
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const handleUpdateAccount = (formData: AccountFormData) => {
    if (!formData.id) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === formData.id
          ? {
              ...acc,
              firstName: formData.firstName,
              lastName: formData.lastName,
              username: formData.username,
              email: formData.email,
              role: formData.role,
              isVerified: formData.isVerified,
              verifiedAt: formData.isVerified
                ? acc.verifiedAt || new Date().toISOString().split("T")[0]
                : null,
            }
          : acc
      )
    );
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((item) => {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVerification =
        verificationFilter === "ALL" ||
        (verificationFilter === "VERIFIED" && item.isVerified) ||
        (verificationFilter === "UNVERIFIED" && !item.isVerified);

      return matchesSearch && matchesVerification;
    });
  }, [accounts, searchQuery, verificationFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Accounts</h1>
          <p className="text-xs text-slate-500">
            Manage staff accounts, roles, and verification status
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* Add Account Button */}
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Account</span>
          </Button>

          {/* Create Modal */}
          <DynamicAccountsFormModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateAccount}
          />

          {/* Edit Modal */}
          <DynamicAccountsFormModal
            open={Boolean(editingAccount)}
            onOpenChange={(open) => {
              if (!open) setEditingAccount(null);
            }}
            initialData={editingAccount ?? undefined}
            isEditMode={true}
            onSubmit={handleUpdateAccount}
          />

          {/* View Mode Modal */}
          <DynamicAccountsFormModal
            open={Boolean(viewingAccount)}
            onOpenChange={(open) => {
              if (!open) setViewingAccount(null);
            }}
            initialData={viewingAccount ?? undefined}
            isViewMode={true}
          />
        </div>
      </div>

      {/* Main Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base min-w-0">
            <Users className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="truncate">Accounts Directory</span>
            <span className="text-xs font-normal text-slate-500 ml-1 hidden md:inline shrink-0">
              • {filteredAccounts.length} Total Accounts
            </span>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() =>
              setVerificationFilter((prev) =>
                prev === "ALL"
                  ? "VERIFIED"
                  : prev === "VERIFIED"
                  ? "UNVERIFIED"
                  : "ALL"
              )
            }
            className={`inline-flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              verificationFilter !== "ALL"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>
              {verificationFilter === "ALL"
                ? "All Accounts"
                : verificationFilter === "VERIFIED"
                ? "Verified Only"
                : "Unverified Only"}
            </span>
          </button>
        </div>

        {/* Accounts List */}
        {filteredAccounts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredAccounts.map((item) => {
              const statusBadge = (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    item.isVerified
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.isVerified ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Unverified
                    </>
                  )}
                </span>
              );

              const actionMenu = (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    }
                  />

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setViewingAccount(item)}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setEditingAccount(item)}
                    >
                      <FileEdit className="h-4 w-4 text-slate-500" />
                      <span>Change Role</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() =>
                        alert(`Verification email sent to ${item.email}`)
                      }
                    >
                      <Send className="h-4 w-4 text-emerald-600" />
                      <span>Send Verify Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                      onClick={() => handleDeleteAccount(item.id)}
                    >
                      <UserX className="h-4 w-4" />
                      <span>Remove Account</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 sm:px-6 hover:bg-slate-50/60 transition-colors"
                >
                  {/* MOBILE VIEW */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-900 block truncate">
                          {item.firstName} {item.lastName}
                        </span>
                        <span className="text-xs font-medium text-emerald-600 block">
                          @{item.username}
                        </span>
                      </div>
                      {actionMenu}
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {item.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        {item.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.verifiedAt ?? "Not verified"}
                      </span>
                      {statusBadge}
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    {/* Name & Username */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.firstName} {item.lastName}
                        </span>
                        <span className="text-xs font-medium text-slate-500 shrink-0">
                          @{item.username}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        {item.email}
                      </p>
                    </div>

                    {/* Role */}
                    <div className="w-36 shrink-0 text-xs">
                      <span className="text-slate-400 block">Role</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Shield className="h-3 w-3 text-slate-400 shrink-0" />
                        {item.role}
                      </span>
                    </div>

                    {/* Verification Date */}
                    <div className="w-32 shrink-0 text-xs">
                      <span className="text-slate-400 block">Verified On</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                        {item.verifiedAt ?? "N/A"}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      {statusBadge}
                      {actionMenu}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <UserIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No accounts found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any user accounts matching your criteria. Try
              altering your search query or filter settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}