"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Users,
  Activity,
  DollarSign,
  Filter,
  MoreVertical,
  ChevronRight,
  UserPlus,
  FileText,
  Phone,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCurrentUser } from "@/lib/redux/slice/user/userSlice";
import { UI_ROUTES } from "@/lib/routes";

const STATS = [
  {
    title: "Today's Appointments",
    value: "12",
    change: "+2 from yesterday",
    icon: CalendarIcon,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Active Patients",
    value: "1,420",
    change: "+18 this month",
    icon: Users,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Procedures Today",
    value: "8",
    change: "4 Completed",
    icon: Activity,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    title: "Daily Revenue",
    value: "$3,450",
    change: "+12% target met",
    icon: DollarSign,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
];

const TODAY_APPOINTMENTS = [
  {
    id: "APT-101",
    time: "09:00 AM",
    patientName: "Emma Watson",
    patientAge: 29,
    procedure: "Root Canal Therapy",
    doctor: "Dr. Sarah Jones",
    status: "Completed",
    chair: "Chair 01",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "APT-102",
    time: "10:30 AM",
    patientName: "Robert Chen",
    patientAge: 42,
    procedure: "Dental Crown Fitting",
    doctor: "Dr. Sarah Jones",
    status: "In Progress",
    chair: "Chair 02",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "APT-103",
    time: "01:15 PM",
    patientName: "Sophia Martinez",
    patientAge: 34,
    procedure: "Routine Teeth Cleaning",
    doctor: "Dr. Alex Miller",
    status: "Confirmed",
    chair: "Chair 01",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "APT-104",
    time: "02:45 PM",
    patientName: "David Miller",
    patientAge: 51,
    procedure: "Tooth Extraction",
    doctor: "Dr. Sarah Jones",
    status: "Confirmed",
    chair: "Chair 03",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

const RECENT_PATIENTS = [
  {
    id: "P-8821",
    name: "Clara Oswald",
    condition: "Gingivitis Tx",
    phone: "+1 (555) 234-5678",
    balance: "$0.00",
  },
  {
    id: "P-8822",
    name: "Marcus Vance",
    condition: "Implant Consult",
    phone: "+1 (555) 876-5432",
    balance: "$150.00",
  },
  {
    id: "P-8823",
    name: "Aaliyah Khan",
    condition: "Orthodontic Check",
    phone: "+1 (555) 345-6789",
    balance: "$0.00",
  },
];

const POPULAR_PROCEDURES = [
  {
    name: "Prophylaxis (Cleaning)",
    category: "Preventative",
    duration: "45 mins",
    cost: "$120",
  },
  {
    name: "Composite Filling",
    category: "Restorative",
    duration: "60 mins",
    cost: "$210",
  },
  {
    name: "Root Canal (Molar)",
    category: "Endodontics",
    duration: "90 mins",
    cost: "$850",
  },
  {
    name: "Porcelain Crown",
    category: "Prosthodontics",
    duration: "75 mins",
    cost: "$1,100",
  },
];

export function DentalDashboardContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Only trigger session check if no user is present in memory
    if (!user && status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [user, status, dispatch]);

  // 2. Console log logged-in user details upon availability
  useEffect(() => {
    if (user) {
      console.log("Logged in User Details:", user);
    }
  }, [user]);

  // 3. Client-side Route Guard: Redirect to login if unauthenticated
  useEffect(() => {
    // Bounce to login ONLY if a fetch completed and failed with no user
    if (status === "failed" && !user) {
      router.replace(UI_ROUTES.AUTH.LOGIN);
    }
  }, [status, user, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
            In Progress
          </span>
        );
      case "Confirmed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            Confirmed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 shrink-0">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.title}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs font-medium text-emerald-600 mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-lg border ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Schedule & Procedures (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Today's Appointment Schedule
                </h2>
                <p className="text-xs text-slate-500">
                  Friday, August 07, 2026
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {TODAY_APPOINTMENTS.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                >
                  <div className="flex items-center justify-between sm:justify-start sm:w-24 shrink-0 sm:border-r sm:border-slate-100 sm:pr-3">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        {apt.time}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {apt.chair}
                      </span>
                    </div>
                    {/* Mobile Status Badge Position */}
                    <div className="sm:hidden">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={apt.avatar}
                      alt={apt.patientName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {apt.patientName}
                        </h4>
                        <span className="text-xs text-slate-400">
                          ({apt.patientAge} yrs)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-700 mt-0.5 truncate">
                        {apt.procedure}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Assigned: {apt.doctor}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Status Badge & Action */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    {getStatusBadge(apt.status)}
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                View Full Day Calendar <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Procedures Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Standard Dental Procedures
                </h2>
                <p className="text-xs text-slate-500">
                  Service catalog and standard durations
                </p>
              </div>
              <button className="text-xs font-semibold text-emerald-700 hover:underline shrink-0">
                + Add Procedure
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Procedure Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Avg Duration</th>
                    <th className="pb-3 text-right">Standard Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {POPULAR_PROCEDURES.map((proc, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3 font-medium text-slate-900">
                        {proc.name}
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {proc.category}
                      </td>
                      <td className="py-3 text-xs text-slate-600">
                        {proc.duration}
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        {proc.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Actions & Patients (1/3 width on desktop) */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 transition-all text-center group">
                <UserPlus className="h-5 w-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">New Patient</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 transition-all text-center group">
                <FileText className="h-5 w-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Create Invoice</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Patients
              </h3>
              <button className="text-xs font-semibold text-emerald-700 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {RECENT_PATIENTS.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {patient.name}
                      </p>
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded shrink-0">
                        {patient.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {patient.condition}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="truncate">{patient.phone}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-700 block">
                      {patient.balance}
                    </span>
                    <span className="text-[10px] text-slate-400">Balance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
