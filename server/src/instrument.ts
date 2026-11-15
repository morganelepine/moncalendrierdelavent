// Must be imported before everything else (see server.ts)
// so that Sentry's automatic instrumentation (http, express, prisma...)
// is set up in time.
//
// dotenv.config() must run first too: locally, nothing else has loaded
// .env yet at this point (Prisma only loads it lazily, when a controller
// instantiates PrismaClient) — without this, process.env.SENTRY_DSN would
// still be undefined below and Sentry would silently stay disabled.
import "dotenv/config";
import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

Sentry.init({
    dsn,
    enabled: !!dsn,
    environment: process.env.NODE_ENV ?? "development",

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production, or using tracesSampler for finer control
    tracesSampleRate: 0.2,

    // Prisma internal spans add noise and quota usage; detect_platform/load_engine also
    // report bogus multi-minute durations when Vercel freezes the function mid-span.
    // Leaf spans only, so the SQL span keeps its prisma:client:operation parent.
    ignoreSpans: [
        /^prisma:client:(detect_platform|load_engine|serialize)$/,
        /^prisma:engine:(serialize|response_json_serialization)$/,
    ],
});
