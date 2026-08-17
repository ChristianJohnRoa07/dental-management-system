"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Paperclip,
  Check,
  Loader2,
  X,
  File,
} from "lucide-react";

// shadcn/ui components
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const patientSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number is too long"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .default(""),
  attachments: z.array(z.custom<File>()).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

const defaultFormValues: PatientFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "Male",
  notes: "",
  attachments: [],
};

function getInitialValues(
  initialData?: Partial<PatientFormData> | null
): PatientFormData {
  if (!initialData) return defaultFormValues;
  return {
    ...defaultFormValues,
    ...initialData,
    notes: initialData.notes ?? "",
    attachments: initialData.attachments ?? [],
  };
}

interface DynamicPatientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<PatientFormData> | null;
  isEditMode?: boolean;
  isViewMode?: boolean; // Controls read-only viewing
  onSubmit?: (data: PatientFormData) => Promise<void>;
}

export default function DynamicPatientFormModal({
  open,
  onOpenChange,
  initialData,
  isEditMode = false,
  isViewMode = false,
  onSubmit,
}: DynamicPatientFormModalProps) {
  const modalMode = isEditMode || Boolean(initialData?.id);

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: getInitialValues(initialData),
  });

  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(initialData));
    }
  }, [open, initialData, form]);

  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: PatientFormData) => {
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
      console.error("Failed to save patient:", error);
    }
  };

  // Determine Title and Subtitle dynamically based on state
  const getHeaderInfo = () => {
    if (isViewMode) {
      return {
        title: "Patient Details",
        description: "View complete patient profile and clinical notes",
      };
    }
    if (modalMode) {
      return {
        title: "Edit Patient Details",
        description: "Update personal contact info and records for this patient",
      };
    }
    return {
      title: "Add New Patient",
      description: "Register a new patient into the system",
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
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto sm:rounded-2xl p-6 sm:p-8">
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
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" /> First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="John"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" /> Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="Doe"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-600" /> Email
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-600" /> Phone
                      Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      Gender
                    </FormLabel>
                    <Select
                      disabled={isViewMode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500 disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-100">
                          <SelectValue placeholder="Select gender..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-emerald-600" />{" "}
                      Attachments / Documents
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {!isViewMode && (
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => {
                              const selectedFiles = Array.from(
                                e.target.files || []
                              );
                              field.onChange([
                                ...(field.value || []),
                                ...selectedFiles,
                              ]);
                            }}
                            className="h-10 bg-slate-50 border-slate-200 rounded-xl file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                          />
                        )}

                        {field.value && field.value.length > 0 ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {field.value.map((file, idx) => (
                              <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200"
                              >
                                <File className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="max-w-[150px] truncate">
                                  {file.name}
                                </span>
                                {!isViewMode && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = field.value?.filter(
                                        (_, i) => i !== idx
                                      );
                                      field.onChange(updated);
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isViewMode ? (
                          <p className="text-xs text-slate-400 italic">
                            No attachments uploaded.
                          </p>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Medical / Personal Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      Medical History & Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isViewMode}
                        rows={3}
                        placeholder={
                          isViewMode
                            ? "No medical notes registered."
                            : "Add dental history notes, allergies, or specific instructions..."
                        }
                        {...field}
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
                        : "Create Patient"}
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