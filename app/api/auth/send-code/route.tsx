import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import db from '@/app/config/db'
import { emailVerifications } from '@/app/config/schema'
import { randomInt } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const code = randomInt(100000, 999999).toString()

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await db.insert(emailVerifications).values({
        email,
        code,
        expiresAt,
    })

    await resend.emails.send({
        from: 'Dietix <onboarding@resend.dev>',
        to: email,
        subject: 'Код подтверждения',
        html: `<h2>Ваш код: ${code}</h2><p>Он действует 10 минут</p>`,
    })

    return NextResponse.json({ message: 'Code sent' })
}
