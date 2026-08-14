"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Armchair,
  FileText,
  Check,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

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

export const appointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Please select a patient"),
  dentistId: z.string().min(1, "Please select an assigned dentist"),
  procedure: z.string().min(1, "Please select a procedure"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time slot is required"),
  chair: z.enum(["Chair 01", "Chair 02", "Chair 03"], {
    message: "Please select a dental chair",
  }),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .default(""),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Default initial values helper
const defaultFormValues: AppointmentFormData = {
  patientId: "",
  dentistId: "",
  procedure: "",
  date: "",
  time: "",
  chair: "Chair 01",
  notes: "",
};

function getInitialValues(
  initialData?: Partial<AppointmentFormData> | null,
): AppointmentFormData {
  if (!initialData) return defaultFormValues;
  return {
    ...defaultFormValues,
    ...initialData,
    notes: initialData.notes ?? "",
  };
}

interface DynamicAppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<AppointmentFormData> | null;
  isEditMode?: boolean;
  onSubmit?: (data: AppointmentFormData) => Promise<void>;
}

export default function DynamicAppointmentFormModal({
  open,
  onOpenChange,
  initialData,
  isEditMode = false,
  onSubmit,
}: DynamicAppointmentFormModalProps) {
  const modalMode = isEditMode || Boolean(initialData?.id);

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    values: getInitialValues(initialData),
  });

  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: AppointmentFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        // Prevent closing if the trigger reason is clicking outside
        if (eventDetails.reason === "outside-press") {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto sm:rounded-2xl p-6 sm:p-8">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {modalMode ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {modalMode
              ? "Update patient session details and chair assignment"
              : "Book a patient session and assign treatment chair"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" /> Patient
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500">
                          <SelectValue placeholder="Select a patient..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="p-8821">
                          Emma Watson (P-8821)
                        </SelectItem>
                        <SelectItem value="p-8822">
                          Robert Chen (P-8822)
                        </SelectItem>
                        <SelectItem value="p-8823">
                          Sophia Martinez (P-8823)
                        </SelectItem>
                        <SelectItem value="p-8824">
                          David Miller (P-8824)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Procedure */}
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-emerald-600" />{" "}
                      Procedure & Service
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500">
                          <SelectValue placeholder="Select a procedure..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Root Canal Therapy">
                          Root Canal Therapy
                        </SelectItem>
                        <SelectItem value="Dental Crown Fitting">
                          Dental Crown Fitting
                        </SelectItem>
                        <SelectItem value="Routine Teeth Cleaning">
                          Routine Teeth Cleaning
                        </SelectItem>
                        <SelectItem value="Tooth Extraction">
                          Tooth Extraction
                        </SelectItem>
                        <SelectItem value="Orthodontic Check">
                          Orthodontic Check
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned Dentist */}
              <FormField
                control={form.control}
                name="dentistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" /> Assigned
                      Dentist
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500">
                          <SelectValue placeholder="Select a dentist..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dr-sarah-jones">
                          Dr. Sarah Jones
                        </SelectItem>
                        <SelectItem value="dr-alex-miller">
                          Dr. Alex Miller
                        </SelectItem>
                        <SelectItem value="dr-john-doe">
                          Dr. John Doe
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-emerald-600" /> Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Slot */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" /> Time Slot
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dental Chair Assignment */}
              <FormField
                control={form.control}
                name="chair"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-emerald-600" /> Dental
                      Chair
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {(["Chair 01", "Chair 02", "Chair 03"] as const).map(
                          (chair) => (
                            <Button
                              type="button"
                              key={chair}
                              variant="outline"
                              onClick={() => field.onChange(chair)}
                              className={cn(
                                "h-10 text-sm font-medium rounded-xl transition-all border",
                                field.value === chair
                                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-800 font-semibold hover:bg-emerald-100/80"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                              )}
                            >
                              {chair}
                            </Button>
                          ),
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />{" "}
                      Additional Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Add dental medical history notes or specific instructions..."
                        {...field}
                        className="bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
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
                      : "Confirm Appointment"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
