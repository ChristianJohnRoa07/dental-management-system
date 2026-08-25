import { NextResponse } from "next/server";
import { ProcedureService } from "@/app/services/procedures/procedure.services";
import { checkSession } from "@/lib/hooks/api/checkSession";
import { Role } from "@/app/generated/prisma/enums";

export const dynamic = "force-dynamic";

// GET /api/procedures - Fetch all procedures (Restricted to ADMIN or DOCTOR)
export const GET = checkSession(
  async () => {
    const procedures = await ProcedureService.getAll();
    return NextResponse.json({ status: "success", data: procedures });
  },
  { requiredRoles: [Role.ADMIN, Role.DOCTOR] },
);

// POST /api/procedures - Create new procedure (Restricted to ADMIN or DOCTOR)
export const POST = checkSession(
  async (req, user) => {
    const body = await req.json();
    const newProcedure = await ProcedureService.create({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(
      { status: "success", data: newProcedure },
      { status: 201 },
    );
  },
  { requiredRoles: [Role.ADMIN, Role.DOCTOR] },
);

// PUT /api/procedures - Update procedure details (Restricted to ADMIN or DOCTOR)
export const PUT = checkSession(
  async (req, user) => {
    const body = await req.json();
    const updatedProcedure = await ProcedureService.update({
      ...body,
      userId: user.id,
    });

    return NextResponse.json({ status: "success", data: updatedProcedure });
  },
  { requiredRoles: [Role.ADMIN, Role.DOCTOR] },
);

// PATCH /api/procedures - Toggle inactive status (Restricted to ADMIN or DOCTOR)
export const PATCH = checkSession(
  async (req, user) => {
    const body = await req.json();
    const updatedProcedure = await ProcedureService.toggleActiveStatus({
      id: body.id,
      userId: user.id,
    });

    return NextResponse.json({ status: "success", data: updatedProcedure });
  },
  { requiredRoles: [Role.ADMIN, Role.DOCTOR] },
);
