import {usersTable} from "@/app/config/schema";
import db from "@/app/config/db";
import {eq} from "drizzle-orm";

export async function ensureValidTariff(user: typeof usersTable.$inferSelect) {
    if (!user.tariffExpiresAt) return user;

    const now = new Date();

    if (new Date(user.tariffExpiresAt) < now) {
        await db
            .update(usersTable)
            .set({
                tariff: "free",
                tariffExpiresAt: null
            })
            .where(eq(usersTable.email, user.email));

        return {
            ...user,
            tariff: "free",
            tariffExpiresAt: null
        };
    }

    return user;
}