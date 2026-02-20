import { NextResponse } from 'next/server'
import db from '@/app/config/db'
import { emailVerifications, usersTable } from '@/app/config/schema'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/app/lib/jwt'

export async function POST(req: Request) {
    const { email, code, password, userName } = await req.json()

    const record = await db
        .select()
        .from(emailVerifications)
        .where(eq(emailVerifications.email, email))
        .limit(1)

    if (!record.length) {
        return NextResponse.json({ error: 'Code not found' }, { status: 400 })
    }

    if (record[0].code !== code) {
        return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    if (new Date(record[0].expiresAt) < new Date()) {
        return NextResponse.json({ error: 'Code expired' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const insertedUser = await db.insert(usersTable).values({
        name: userName,
        email,
        password: hashedPassword,
        credits: 1,
        createdAt: new Date().toISOString(),
        tariff: 'free'
    }).returning()

    const user = insertedUser[0]
    const token = generateToken({ email: user.email })

    return NextResponse.json({ token })
}
