"use client";

import React, { useMemo, useState } from "react";
import {
  UserPlus,
  Filter,
  MoreVertical,
  Users,
  Search,
  FileEdit,
  Phone,
  Mail,
  FileText,
  UserX,
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
import DynamicPatientFormModal, {
  PatientFormData,
} from "@/components/patient/dynamicPatientForm";

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  lastVisit: string;
  status: "Active" | "Inactive";
  avatar: string;
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "1",
    name: "Emma Watson",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "emma.watson@example.com",
    lastVisit: "Aug 05, 2026",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    id: "2",
    name: "Robert Chen",
    age: 42,
    gender: "Male",
    phone: "+1 (555) 876-5432",
    email: "robert.chen@example.com",
    lastVisit: "Jul 22, 2026",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: "3",
    name: "Sophia Martinez",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 345-6789",
    email: "sophia.m@example.com",
    lastVisit: "Jun 14, 2026",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
  {
    id: "4",
    name: "David Miller",
    age: 51,
    gender: "Male",
    phone: "+1 (555) 987-6543",
    email: "david.miller@example.com",
    lastVisit: "Jan 10, 2026",
    status: "Inactive",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  },
];

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

function patientToFormData(patient: PatientRecord): Partial<PatientFormData> {
  const { firstName, lastName } = splitFullName(patient.name);
  return {
    id: patient.id,
    firstName,
    lastName,
    email: patient.email,
    phone: patient.phone,
    gender: patient.gender,
  };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(
    null
  );
  const [viewingPatient, setViewingPatient] = useState<PatientRecord | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "ALL" || item.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const handleCreatePatient = async (data: PatientFormData) => {
    const newPatient: PatientRecord = {
      id: String(Date.now()),
      name: `${data.firstName} ${data.lastName}`.trim(),
      age: 0,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      lastVisit: "Just now",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    };

    setPatients((prev) => [newPatient, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdatePatient = async (data: PatientFormData) => {
    if (!editingPatient) return;

    const updatedPatient: PatientRecord = {
      ...editingPatient,
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      gender: data.gender,
    };

    setPatients((prev) =>
      prev.map((p) => (p.id === editingPatient.id ? updatedPatient : p))
    );
    setEditingPatient(null);
  };

  const handleDeactivatePatient = (id: string) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, status: "Inactive" } : patient
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Patients</h1>
          <p className="text-xs text-slate-500">
            Manage patient profiles, contact info, and medical records
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* Add Patient Button */}
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Button>

          {/* Create Modal Instance */}
          <DynamicPatientFormModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreatePatient}
          />

          {/* Edit Modal Instance */}
          <DynamicPatientFormModal
            open={Boolean(editingPatient)}
            onOpenChange={(open) => {
              if (!open) setEditingPatient(null);
            }}
            initialData={
              editingPatient ? patientToFormData(editingPatient) : null
            }
            isEditMode={true}
            onSubmit={handleUpdatePatient}
          />

          {/* View Modal Instance */}
          <DynamicPatientFormModal
            open={Boolean(viewingPatient)}
            onOpenChange={(open) => {
              if (!open) setViewingPatient(null);
            }}
            initialData={
              viewingPatient ? patientToFormData(viewingPatient) : null
            }
            isViewMode={true}
          />
        </div>
      </div>

      {/* Main Patient Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base min-w-0">
            <Users className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="truncate">Patient Directory</span>
            <span className="text-xs font-normal text-slate-500 ml-1 hidden md:inline shrink-0">
              • {filteredPatients.length} Total Patients
            </span>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() =>
              setStatusFilter((prev) => (prev === "ALL" ? "ACTIVE" : "ALL"))
            }
            className={`inline-flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              statusFilter !== "ALL"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{statusFilter === "ALL" ? "Filter" : "Active Only"}</span>
          </button>
        </div>

        {/* Patient List */}
        {filteredPatients.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredPatients.map((item) => {
              const statusBadge = (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    item.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
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
                      <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setEditingPatient(item)}
                    >
                      <FileEdit className="h-4 w-4 text-slate-500" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setViewingPatient(item)}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                      onClick={() => handleDeactivatePatient(item.id)}
                    >
                      <UserX className="h-4 w-4" />
                      <span>Set Inactive</span>
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
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0">
                              ({item.age} yrs, {item.gender})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{item.phone}</span>
                          </p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{item.email}</span>
                          </p>
                        </div>
                      </div>
                      {actionMenu}
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80">
                      <span className="text-xs text-slate-500">
                        Last Visit:{" "}
                        <strong className="text-slate-700">
                          {item.lastVisit}
                        </strong>
                      </span>
                      {statusBadge}
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({item.age} yrs, {item.gender})
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 truncate">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            {item.phone}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-36 shrink-0 text-xs">
                      <span className="text-slate-400 block">Last Visit</span>
                      <span className="font-semibold text-slate-700 block">
                        {item.lastVisit}
                      </span>
                    </div>

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
          <div className="p-8 sm:p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No patients found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any patient matching your criteria. Try altering
              your search query or filter settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}