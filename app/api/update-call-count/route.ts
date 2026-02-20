import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import getServerUser from "@/app/lib/auth-server";
import db from "@/app/config/db";
import {usersTable} from "@/app/config/schema";


export async function POST(req: NextRequest) {

    const user =await getServerUser();

    const { aiCallCount  } = await req.json();

    await db.update(usersTable)
        .set({ aiCallCount })
        .where(eq(usersTable.email, user?.email));
    console.log('aiCallCount=---')
    console.log(aiCallCount)
    return NextResponse.json({ success: true });
}
