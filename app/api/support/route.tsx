import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
    try {
        const { email, message } = await req.json()

        if (!email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER,
            subject: "Запрос в поддержку Диетикса",
            html: `
        <p><b>Email пользователя:</b> ${email}</p>
        <p><b>Сообщение:</b></p>
        <p>${message}</p>
      `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Mail error" }, { status: 500 })
    }
}
