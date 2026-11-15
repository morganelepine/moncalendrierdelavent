import { EventController } from "../controllers/event.controller";

export const EventRoutes = [
    {
        method: "post",
        route: "/events",
        controller: EventController,
        action: "track",
    },
];
