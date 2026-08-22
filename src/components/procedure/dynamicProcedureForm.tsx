"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stethoscope,
  PhilippinePeso,
  Check,
  Loader2,
  FileText,
  Activity,
  Tag,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const procedureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Procedure name is required"),
  category: z.string().optional(),
  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price cannot be negative"),
  isActive: z.boolean(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export type ProcedureFormData = z.infer<typeof procedureSchema>;

const defaultFormValues: ProcedureFormData = {
  name: "",
  category: "",
  price: 0,
  isActive: true,
  description: "",
};

function getInitialValues(
  initialData?: Partial<ProcedureFormData> | null,
): ProcedureFormData {
  if (!initialData) return defaultFormValues;
  return {
    ...defaultFormValues,
    ...initialData,
    price: initialData.price ?? 0,
    isActive: initialData.isActive ?? true,
    description: initialData.description ?? "",
  };
}

interface DynamicProcedureFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProcedureFormData> | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  onSubmit?: (data: ProcedureFormData) => Promise<void>;
}

export default function DynamicProcedureFormModal({
  open,
  onOpenChange,
  initialData,
  isEditMode = false,
  isViewMode = false,
  onSubmit,
}: DynamicProcedureFormModalProps) {
  const modalMode = isEditMode || Boolean(initialData?.id);

  const form = useForm<ProcedureFormData>({
    resolver: zodResolver(procedureSchema),
    defaultValues: getInitialValues(initialData),
  });

  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(initialData));
    }
  }, [open, initialData, form]);

  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: ProcedureFormData) => {
    if (isViewMode) {
      onOpenChange(false);
      return;
    }
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save procedure:", error);
    }
  };

  const getHeaderInfo = () => {
    if (isViewMode) {
      return {
        title: "Procedure Details",
        description: "View procedure details and pricing.",
      };
    }
    if (modalMode) {
      return {
        title: "Edit Procedure Details",
        description: "Update treatment catalog details and pricing.",
      };
    }
    return {
      title: "Add New Procedure",
      description: "Register a new dental procedure into the catalog.",
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        // Prevent accidental dismiss only during active editing/creating
        if (!isViewMode && eventDetails?.reason === "outside-press") {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-xl w-full max-h-[90vh] overflow-y-auto sm:rounded-2xl p-6 sm:p-8">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {headerInfo.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {headerInfo.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Procedure Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-emerald-600" />{" "}
                      Procedure Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="e.g., Root Canal Therapy"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" /> Category
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="e.g., Oral Surgery"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <PhilippinePeso className="h-4 w-4 text-emerald-600" /> Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="150.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                      <Activity className="h-4 w-4 text-emerald-600" /> Status
                    </FormLabel>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500 font-medium">
                        {field.value ? "Active" : "Inactive"}
                      </span>
                      <FormControl>
                        <Switch
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />{" "}
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isViewMode}
                        rows={3}
                        placeholder={
                          isViewMode
                            ? "No procedure description provided."
                            : "Add notes or details..."
                        }
                        {...field}
                        value={field.value ?? ""}
                        className="bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 resize-none disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
              {isViewMode ? (
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Done
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    <span>
                      {isSubmitting
                        ? "Saving..."
                        : modalMode
                          ? "Save Changes"
                          : "Create Procedure"}
                    </span>
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
