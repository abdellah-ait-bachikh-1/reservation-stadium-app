import { getLocaleFromNextIntlCookie } from "@/lib/api/locale";
import db from "@/lib/db";
import { TLocale } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let locale: TLocale = "en";

  try {
    locale = await getLocaleFromNextIntlCookie();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    
    console.log({token});

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: "No verification token provided",
          status: "invalid_token"
        },
        { status: 400 }
      );
    }

    // Find user with this token - also check if NOT soft deleted
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        deletedAt: null, // This is the key: exclude soft-deleted users
      },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      // Check if user exists but is soft deleted
      const softDeletedUser = await db.user.findFirst({
        where: {
          verificationToken: token,
          deletedAt: { not: null }, // User exists but is soft deleted
        },
        select: {
          id: true,
          email: true,
          deletedAt: true,
        },
      });

      if (softDeletedUser) {
        return NextResponse.json(
          { 
            success: false,
            message: "This account has been deactivated. Please contact support.",
            status: "user_deleted" // New status for soft-deleted users
          },
          { status: 410 } // 410 Gone - resource no longer available
        );
      }

      return NextResponse.json(
        { 
          success: false,
          message: "Invalid or expired verification token",
          status: "user_not_found"
        },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { 
          success: true,
          message: "Email already verified",
          status: "already_verified",
          user: {
            email: user.email
          }
        },
        { status: 200 }
      );
    }

    // First-time verification - DON'T set verificationToken to null
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        // Keep verificationToken as is
      },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Email successfully verified",
        status: "verified",
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        status: "error"
      },
      { status: 500 }
    );
  }
}