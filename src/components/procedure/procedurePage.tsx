"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  Stethoscope,
  Search,
  FileEdit,
  Clock,
  DollarSign,
  FileText,
  Activity,
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
import DynamicProcedureFormModal, {
  ProcedureFormData,
} from "@/components/procedure/dynamicProcedureForm";

export interface ProcedureRecord {
  id: string;
  name: string;
  category: string;
  cost: number;
  status: "Active" | "Inactive";
  description?: string;
}

const INITIAL_PROCEDURES: ProcedureRecord[] = [
  {
    id: "1",
    name: "Root Canal Therapy",
    category: "Endodontics",
    cost: 650,
    status: "Active",
    description: "Treatment of the tooth's root canals and inflamed pulp.",
  },
  {
    id: "2",
    name: "Dental Crown Fitting",
    category: "Prosthodontics",
    cost: 800,
    status: "Active",
    description: "Custom tooth-shaped cap placement to restore structure.",
  },
  {
    id: "3",
    name: "Routine Teeth Cleaning",
    category: "Preventive",
    cost: 120,
    status: "Active",
    description: "Plaque/tartar removal and tooth polishing.",
  },
  {
    id: "4",
    name: "Surgical Tooth Extraction",
    category: "Oral Surgery",
    cost: 350,
    status: "Inactive",
    description: "Removal of severely damaged or impacted teeth.",
  },
];

function procedureToFormData(
  procedure: ProcedureRecord
): Partial<ProcedureFormData> {
  return {
    id: procedure.id,
    name: procedure.name,
    category: procedure.category,
    cost: procedure.cost,
    description: procedure.description ?? "",
  };
}

export default function ProceduresPage() {
  const [procedures, setProcedures] =
    useState<ProcedureRecord[]>(INITIAL_PROCEDURES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [editingProcedure, setEditingProcedure] =
    useState<ProcedureRecord | null>(null);
  const [viewingProcedure, setViewingProcedure] =
    useState<ProcedureRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProcedures = useMemo(() => {
    return procedures.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || item.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [procedures, searchQuery, statusFilter]);

  const handleCreateProcedure = async (data: ProcedureFormData) => {
    const newProcedure: ProcedureRecord = {
      id: String(Date.now()),
      name: data.name,
      category: data.category,
      cost: Number(data.cost),
      status: "Active",
      description: data.description,
    };

    setProcedures((prev) => [newProcedure, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProcedure = async (data: ProcedureFormData) => {
    if (!editingProcedure) return;

    const updatedProcedure: ProcedureRecord = {
      ...editingProcedure,
      name: data.name,
      category: data.category,
      cost: Number(data.cost),
      description: data.description,
    };

    setProcedures((prev) =>
      prev.map((p) => (p.id === editingProcedure.id ? updatedProcedure : p))
    );
    setEditingProcedure(null);
  };

  const handleToggleProcedureStatus = (id: string) => {
    setProcedures((prev) =>
      prev.map((proc) =>
        proc.id === id
          ? {
              ...proc,
              status: proc.status === "Active" ? "Inactive" : "Active",
            }
          : proc
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Dental Procedures
          </h1>
          <p className="text-xs text-slate-500">
            Manage treatment procedure, and pricing
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* Add Procedure Button */}
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Procedure</span>
          </Button>

          {/* Create Modal */}
          <DynamicProcedureFormModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateProcedure}
          />

          {/* Edit Modal */}
          <DynamicProcedureFormModal
            open={Boolean(editingProcedure)}
            onOpenChange={(open) => {
              if (!open) setEditingProcedure(null);
            }}
            initialData={
              editingProcedure ? procedureToFormData(editingProcedure) : null
            }
            isEditMode={true}
            onSubmit={handleUpdateProcedure}
          />

          {/* View Modal */}
          <DynamicProcedureFormModal
            open={Boolean(viewingProcedure)}
            onOpenChange={(open) => {
              if (!open) setViewingProcedure(null);
            }}
            initialData={
              viewingProcedure ? procedureToFormData(viewingProcedure) : null
            }
            isViewMode={true}
          />
        </div>
      </div>

      {/* Main Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base min-w-0">
            <Stethoscope className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="truncate">Procedure Catalog</span>
            <span className="text-xs font-normal text-slate-500 ml-1 hidden md:inline shrink-0">
              • {filteredProcedures.length} Total Procedures
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

        {/* Procedures List */}
        {filteredProcedures.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredProcedures.map((item) => {
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setViewingProcedure(item)}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setEditingProcedure(item)}
                    >
                      <FileEdit className="h-4 w-4 text-slate-500" />
                      <span>Edit Procedure</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
                          {item.name}
                        </span>
                        <span className="text-xs font-medium text-emerald-600 block">
                          {item.category}
                        </span>
                      </div>
                      {actionMenu}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        ${item.cost}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80">
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {item.description || "No description provided."}
                      </p>
                      {statusBadge}
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {item.description || "No description provided."}
                      </p>
                    </div>

                    <div className="w-24 shrink-0 text-xs">
                      <span className="text-slate-400 block">Cost</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                        <DollarSign className="h-3 w-3 text-slate-400" />
                        {item.cost}
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
          /* Empty State */
          <div className="p-8 sm:p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No procedures found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any dental procedures matching your criteria.
              Try altering your search query or filter settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}