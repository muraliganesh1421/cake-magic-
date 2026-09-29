import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const staff = store.getStaff();
  return NextResponse.json(staff);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { staffId, dutyStatus, updates } = body;

    if (!staffId) {
      return NextResponse.json({ error: "staffId is required" }, { status: 400 });
    }

    if (dutyStatus !== undefined) {
      const updated = store.setStaffDuty(staffId, dutyStatus);
      if (!updated) {
        return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    if (updates) {
      const staffList = store.getStaff();
      const member = staffList.find((s) => s.id === staffId);
      if (!member) {
        return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
      }
      const updatedMember = store.saveStaffMember({ ...member, ...updates });
      return NextResponse.json(updatedMember);
    }

    return NextResponse.json({ error: "No valid operation specified" }, { status: 400 });
  } catch (err: unknown) {
    console.error("PATCH /api/staff error:", err);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}
