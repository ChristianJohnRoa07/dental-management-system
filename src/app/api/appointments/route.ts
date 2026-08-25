import { NextResponse } from "next/server";
import { AppointmentService } from "@/app/services/appointments/appointment.services";
import { checkSession } from "@/lib/hooks/api/checkSession";

export const dynamic = "force-dynamic";

// GET /api/appointments - Fetch appointments (Filtered by query string)
export const GET = checkSession(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let result;

  if (type === "TODAY") {
    result = await AppointmentService.getTodaysAppointments();
  } else if (type === "SCHEDULED") {
    result = await AppointmentService.getAppointmentsForConfirmation();
  } else {
    result = await AppointmentService.getAll();
  }

  return NextResponse.json({ status: "success", data: result });
});

// POST /api/appointments - Create new appointment (Restricted to ADMIN or DOCTOR)
export const POST = checkSession(
  async (req, user) => {
    const body = await req.json();

    const newAppointment = await AppointmentService.create({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(
      { status: "success", data: newAppointment },
      { status: 201 },
    );
  },
);
