import { db } from "@/drizzle/db";
import { isErrorHasMessage } from "@/utils";
import { ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sports = await db.query.sports.findMany({
      columns: { id: true, nameAr: true, nameFr: true, icon: true },
      where: (sports, { isNull }) => isNull(sports.deletedAt),
    });
    return NextResponse.json(sports, { status: 200 });
  } catch (error) {
    if (isErrorHasMessage(error)) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "unknown error" }, { status: 500 });
    }
  }
}
