import { Request } from "express";

// Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on its own invocations,
// including Vercel Schedules with a `path` target, see https://vercel.com/docs/schedules/migrate-from-cron-jobs
export function isCronRequest(request: Request): boolean {
    return (
        !!process.env.CRON_SECRET &&
        request.headers.authorization === `Bearer ${process.env.CRON_SECRET}`
    );
}
