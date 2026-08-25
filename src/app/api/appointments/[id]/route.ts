import { NextResponse } from "next/server";
import { AppointmentService } from "@/app/services/appointments/appointment.services";
import { ERROR_CODES } from "@/lib/constants";
import { checkSession } from "@/lib/hooks/api/checkSession";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

// GET /api/appointments/[id] - Fetch appointment details
export const GET = checkSession<RouteContext>(async (req, context) => {
  const resolvedParams = await context.params;
  const appointmentId = resolvedParams.id;

  const appointment = await AppointmentService.getAppointmentDetails({
    appointmentId,
  });

  return NextResponse.json({ status: "success", data: appointment });
});

// PUT /api/appointments/[id] - Update appointment details (Restricted to ADMIN or DOCTOR)
export const PUT = checkSession<RouteContext>(
  async (req, context, user) => {
    const resolvedParams = await context.params;
    const appointmentId = resolvedParams.id;
    const body = await req.json();

    const updatedAppointment = await AppointmentService.update({
      ...body,
      appointmentId,
      userId: user.id,
    });

    return NextResponse.json(
      { status: "success", data: updatedAppointment },
      { status: 200 },
    );
  },
);

// PATCH /api/appointments/[id] - Execute status actions (Restricted to ADMIN or DOCTOR)
export const PATCH = checkSession<RouteContext>(
  async (req, context, user) => {
    const resolvedParams = await context.params;
    const appointmentId = resolvedParams.id;

    const body = await req.json();
    const { action, procedurePrice, amountReceived } = body;

    if (!action) {
      return NextResponse.json(
        {
          status: "error",
          message: `${ERROR_CODES.VALIDATION_ERROR}: Missing 'action' field in request body.`,
        },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case "confirm":
        result = await AppointmentService.confirmAppointment({
          appointmentId,
          userId: user.id,
        });
        break;
      case "cancel":
        result = await AppointmentService.cancelAppointment({
          appointmentId,
          userId: user.id,
        });
        break;
      case "assignProcedurePrice":
        result = await AppointmentService.assignProcedurePrice({
          appointmentId,
          procedurePrice,
          userId: user.id,
        });
        break;
      case "complete":
        result = await AppointmentService.completeAppointment({
          appointmentId,
          amountReceived,
          userId: user.id,
        });
        break;
      default:
        return NextResponse.json(
          {
            status: "error",
            message: `${ERROR_CODES.VALIDATION_ERROR}: Invalid action type.`,
          },
          { status: 400 },
        );
    }

    return NextResponse.json(
      { status: "success", data: result },
      { status: 200 },
    );
  },
);
