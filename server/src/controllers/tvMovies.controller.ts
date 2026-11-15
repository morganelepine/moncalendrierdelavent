import { Request, Response, NextFunction } from "express";
import {
    getTvMoviesByDate,
    secondsUntilFeedRefresh,
} from "../services/tvMovies.service";

export class TvMoviesController {
    // GET /tv-movies?date=yyyy-mm-dd
    // The client sends its own "today" so the CDN cache key changes at
    // midnight (and the fake date of the Test screen works).
    async getTvMovies(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const date = request.query.date;
        if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return { status: 400, error: "Invalid date" };
        }

        // A feed failure throws (500, reported to Sentry, never cached):
        // the app then falls back to its locally cached schedule.
        const movies = await getTvMoviesByDate(date);

        response.setHeader(
            "Cache-Control",
            `public, s-maxage=${secondsUntilFeedRefresh()}, stale-while-revalidate=86400`,
        );

        return { status: 200, movies };
    }
}
