"use client";

import React, { useEffect, useMemo } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  Stethoscope,
  Search,
  FileEdit,
  DollarSign,
  FileText,
  Power,
  Clock,
  UserCheck,
  PhilippinePeso,
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
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import DynamicProcedureFormModal from "@/components/procedure/dynamicProcedureForm";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import {
  setSearchQuery,
  setStatusFilter,
  setIsCreateModalOpen,
  setEditingProcedure,
  setViewingProcedure,
  createProcedure,
  updateProcedure,
  toggleProcedureStatus,
  ProcedureFormData,
  UpdateProcedureFormData,
  getProcedures,
  ProcedureRecord,
  clearMessages,
} from "@/lib/redux/slice/procedure/procedurePageSlice";

export default function ProceduresPage() {
  const dispatch = useAppDispatch();

  const {
    procedures,
    searchQuery,
    statusFilter,
    editingProcedure,
    viewingProcedure,
    isCreateModalOpen,
    fetchStatus,
    successMessage,
    error,
  } = useAppSelector((state: RootState) => state.procedures);

  useEffect(() => {
    dispatch(getProcedures());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const filteredProcedures = useMemo(() => {
    if (!procedures) return [];

    const query = searchQuery.toLowerCase();

    return procedures.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        (item.category?.toLowerCase().includes(query) ?? false);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && item.isActive) ||
        (statusFilter === "INACTIVE" && !item.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [procedures, searchQuery, statusFilter]);

  const procedureToFormData = (
    procedure: ProcedureRecord,
  ): ProcedureFormData => {
    return {
      name: procedure.name,
      category: procedure.category ?? "",
      price: procedure.price,
      description: procedure.description ?? "",
      isActive: procedure.isActive,
      updatedAt: procedure.updatedAt,
      updatedBy: procedure.updatedBy,
    };
  };

  const updateProcedureToFormData = (
    procedure: ProcedureRecord,
  ): UpdateProcedureFormData => {
    return {
      id: procedure.id,
      name: procedure.name,
      category: procedure.category ?? "",
      price: procedure.price,
      description: procedure.description ?? "",
      isActive: procedure.isActive,
    };
  };

  const handleCreateProcedure = async (data: ProcedureFormData) => {
    dispatch(createProcedure(data));
  };

  const handleUpdateProcedure = async (data: ProcedureFormData) => {
    if (!editingProcedure?.id) return;

    dispatch(
      updateProcedure({
        ...data,
        id: editingProcedure.id,
      }),
    );
  };

  const handleToggleProcedureStatus = (id: string) => {
    dispatch(toggleProcedureStatus({ id }));
  };

  const isFetchLoading = fetchStatus === "loading";

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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search procedures..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>

          <Button
            type="button"
            onClick={() => dispatch(setIsCreateModalOpen(true))}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Procedure</span>
          </Button>

          <DynamicProcedureFormModal
            open={isCreateModalOpen}
            onOpenChange={(open) => dispatch(setIsCreateModalOpen(open))}
            onSubmit={handleCreateProcedure}
          />

          <DynamicProcedureFormModal
            open={Boolean(editingProcedure)}
            onOpenChange={(open) => {
              if (!open) dispatch(setEditingProcedure(null));
            }}
            initialData={
              editingProcedure
                ? updateProcedureToFormData(editingProcedure)
                : null
            }
            isEditMode={true}
            onSubmit={handleUpdateProcedure}
          />

          <DynamicProcedureFormModal
            open={Boolean(viewingProcedure)}
            onOpenChange={(open) => {
              if (!open) dispatch(setViewingProcedure(null));
            }}
            initialData={
              viewingProcedure ? procedureToFormData(viewingProcedure) : null
            }
            isViewMode={true}
          />
        </div>
      </div>

      {/* Main Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base min-w-0">
            <Stethoscope className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="truncate">Procedure Catalog</span>
            <span className="text-xs font-normal text-slate-500 ml-1 hidden md:inline shrink-0">
              • {isFetchLoading ? "..." : filteredProcedures.length} Total
              Procedures
            </span>
          </div>

          <button
            onClick={() =>
              dispatch(
                setStatusFilter(statusFilter === "ALL" ? "ACTIVE" : "ALL"),
              )
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

        {/* Procedures Content */}
        {isFetchLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
            <Spinner className="h-8 w-8" />
            <p className="text-xs font-medium text-slate-500">
              Loading procedures...
            </p>
          </div>
        ) : filteredProcedures.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredProcedures.map((item) => {
              const statusBadge = (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
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
                      onClick={() => dispatch(setViewingProcedure(item))}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => dispatch(setEditingProcedure(item))}
                    >
                      <FileEdit className="h-4 w-4 text-slate-500" />
                      <span>Edit Procedure</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => handleToggleProcedureStatus(item.id)}
                    >
                      <Power className="h-4 w-4 text-amber-500" />
                      <span>{item.isActive ? "Deactivate" : "Activate"}</span>
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
                        <PhilippinePeso className="h-3.5 w-3.5 text-slate-400" />$
                        {item.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate max-w-[280px]">
                      {item.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80">
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
          <div className="flex-1 p-8 sm:p-12 text-center space-y-3 flex flex-col justify-center items-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No procedures found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any dental procedures matching your criteria. Try
              altering your search query or filter settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
