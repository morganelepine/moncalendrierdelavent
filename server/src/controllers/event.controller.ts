import { Request } from "express";
import { prisma } from "../lib/prisma";

// Format check instead of a list of known events,
// so adding one only needs a client release.
const EVENT_PATTERN = /^[a-z0-9_]{1,50}$/;
const MAX_FIELD_LENGTH = 100;

const optionalString = (value: unknown): string | null =>
    typeof value === "string" && value
        ? value.slice(0, MAX_FIELD_LENGTH)
        : null;

export class EventController {
    async track(request: Request) {
        const { event, source, userUuid, platform, appVersion } = request.body;

        if (
            typeof event !== "string" ||
            !EVENT_PATTERN.test(event) ||
            typeof userUuid !== "string" ||
            !userUuid ||
            typeof platform !== "string" ||
            !platform
        ) {
            return { status: 400, message: "Invalid event" };
        }

        await prisma.clickEvent.create({
            data: {
                event,
                source: optionalString(source),
                userUuid: userUuid.slice(0, MAX_FIELD_LENGTH),
                platform: platform.slice(0, MAX_FIELD_LENGTH),
                appVersion: optionalString(appVersion),
            },
        });

        return { status: 201 };
    }
}
