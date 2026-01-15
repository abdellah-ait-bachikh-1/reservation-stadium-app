// app/api/public/current-user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByIdForAuth } from "@/lib/queries/user";
import { db } from "@/drizzle/db";

// GET /api/public/current-user/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user from database
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      columns: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        preferredLocale: true,
        isApproved: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      with: { clubs: true },
    });

    if (!user || !user.emailVerifiedAt || !user.isApproved || user.deletedAt !== null) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Don't expose sensitive info
    const safeUser = {
      ...user,
      // Remove sensitive fields if needed
      // emailVerifiedAt: undefined,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
