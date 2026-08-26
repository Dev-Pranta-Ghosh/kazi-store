import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  // ১. DATABASE_URL না থাকলে সরাসরি ফেল না মেরে হ্যান্ডেল করবে
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { ok: false, error: "DATABASE_URL is missing" },
      { status: 500 }
    );
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}