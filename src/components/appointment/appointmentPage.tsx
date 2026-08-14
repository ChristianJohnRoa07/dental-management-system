"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  Clock,
  FileEdit,
  XCircle,
} from "lucide-react";
import { UI_ROUTES } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import DynamicAppointmentFormModal from "@/components/appointment/dynamicAppointmentForm";
import { Button } from "../ui/button";
import { Appointment } from "@/app/generated/prisma/client";

const APPOINTMENTS = [
  {
    id: "1",
    time: "09:00 AM",
    chair: "Chair 01",
    patientName: "Emma Watson",
    age: 29,
    procedure: "Root Canal Therapy",
    dentist: "Dr. Sarah Jones",
    status: "Completed",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    id: "2",
    time: "10:30 AM",
    chair: "Chair 02",
    patientName: "Robert Chen",
    age: 42,
    procedure: "Dental Crown Fitting",
    dentist: "Dr. Sarah Jones",
    status: "In Progress",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: "3",
    time: "01:15 PM",
    chair: "Chair 01",
    patientName: "Sophia Martinez",
    age: 34,
    procedure: "Routine Teeth Cleaning",
    dentist: "Dr. Alex Miller",
    status: "Confirmed",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
  {
    id: "4",
    time: "02:45 PM",
    chair: "Chair 03",
    patientName: "David Miller",
    age: 51,
    procedure: "Tooth Extraction",
    dentist: "Dr. Sarah Jones",
    status: "Confirmed",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  },
];

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Real-time filtering logic
  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dentist.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || item.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleCreateAppointment = async () => {
    // Implement API call or dispatch action here
    setIsCreateModalOpen(false);
  };

  const handleUpdateAppointment = async (formData: any) => {
    if (!editingAppointment) return;

    // Perform your update logic here (API call / state update)
    console.log("Updating appointment ID:", editingAppointment.id, formData);

    // Close the edit modal upon success
    setEditingAppointment(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-500">
            Manage dental schedule and treatment chair assignments
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* New Appointment Redirect Button */}
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>New Appointment</span>
          </Button>

          {/* Create Modal */}
          <DynamicAppointmentFormModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateAppointment}
          />

          {/* Edit Modal */}
          <DynamicAppointmentFormModal
            open={Boolean(editingAppointment)}
            onOpenChange={(open) => {
              if (!open) setEditingAppointment(null);
            }}
            initialData={editingAppointment}
            isEditMode={true}
            onSubmit={handleUpdateAppointment}
          />
        </div>
      </div>

      {/* Main Schedule Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table / Schedule Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base min-w-0">
            <CalendarIcon className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="truncate">Today's Schedule</span>
            <span className="text-xs font-normal text-slate-500 ml-1 hidden md:inline shrink-0">
              • Friday, August 07, 2026
            </span>
          </div>

          {/* Filter Options */}
          <button
            onClick={() =>
              setStatusFilter((prev) => (prev === "ALL" ? "CONFIRMED" : "ALL"))
            }
            className={`inline-flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              statusFilter !== "ALL"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{statusFilter === "ALL" ? "Filter" : "Confirmed"}</span>
          </button>
        </div>

        {/* Appointment List */}
        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((item) => {
              // Shared Status Badge Styling
              const statusBadge = (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    item.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
              );

              // Shared Action Menu Component
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
                      onClick={() =>
                        setEditingAppointment(item as unknown as Appointment)
                      }
                    >
                      <FileEdit className="h-4 w-4 text-slate-500" />
                      <span>Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Mark Completed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Mark In Progress</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>Cancel Appointment</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 sm:px-6 hover:bg-slate-50/60 transition-colors"
                >
                  {/* --- MOBILE VIEW (< sm) --- */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {/* Top Row: Patient Info & Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.patientName}
                          className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {item.patientName}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0">
                              ({item.age} yrs)
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-600 truncate">
                            {item.procedure}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            Assigned: {item.dentist}
                          </p>
                        </div>
                      </div>
                      {actionMenu}
                    </div>

                    {/* Bottom Row: Time, Chair & Status */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                          {item.time}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 font-medium">
                          {item.chair}
                        </span>
                      </div>
                      {statusBadge}
                    </div>
                  </div>

                  {/* --- DESKTOP VIEW (≥ sm) --- */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    {/* Time & Chair */}
                    <div className="w-28 shrink-0">
                      <span className="text-sm font-bold text-slate-900 block">
                        {item.time}
                      </span>
                      <span className="text-xs text-slate-400 block font-medium">
                        {item.chair}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.avatar}
                        alt={item.patientName}
                        className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {item.patientName}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({item.age} yrs)
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 truncate">
                          {item.procedure}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          Assigned: {item.dentist}
                        </p>
                      </div>
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
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No appointments found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any schedule matching your criteria. Try altering
              your search query or filter settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}