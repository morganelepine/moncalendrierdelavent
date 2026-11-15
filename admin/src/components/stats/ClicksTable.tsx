import { Fragment, useState } from "react";
import {
    CLICK_EVENT_LABELS,
    CLICK_SOURCE_LABELS,
} from "../../constants/clickEvents";
import { Stats } from "../../types";
import { formatNumber } from "./statsFormat";

export function ClicksTable({ rows }: Readonly<{ rows: Stats["clicks"] }>) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggle = (event: string) => {
        setExpanded((current) => {
            const next = new Set(current);
            if (next.has(event)) next.delete(event);
            else next.add(event);
            return next;
        });
    };

    if (rows.length === 0) return <p className="hint">Aucun clic.</p>;

    return (
        <div className="clicks-scroll">
            <table className="clicks-table">
                <thead>
                    <tr>
                        <th scope="col">Action</th>
                        <th scope="col">Clics</th>
                        <th scope="col">Users</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const label =
                            CLICK_EVENT_LABELS[row.event] ?? row.event;
                        const isOpen = expanded.has(row.event);
                        return (
                            <Fragment key={row.event}>
                                <tr>
                                    <th scope="row">
                                        {row.sources.length > 0 ? (
                                            <button
                                                type="button"
                                                className="clicks-toggle"
                                                aria-expanded={isOpen}
                                                onClick={() =>
                                                    toggle(row.event)
                                                }
                                            >
                                                <span aria-hidden="true">
                                                    {isOpen ? "▾" : "▸"}
                                                </span>{" "}
                                                {label}
                                            </button>
                                        ) : (
                                            label
                                        )}
                                    </th>
                                    <td>{formatNumber(row.clicks)}</td>
                                    <td>{formatNumber(row.users)}</td>
                                </tr>
                                {isOpen &&
                                    row.sources.map((source) => (
                                        <tr
                                            key={source.source}
                                            className="clicks-source"
                                        >
                                            <th scope="row">
                                                {CLICK_SOURCE_LABELS[
                                                    source.source
                                                ] ?? source.source}
                                            </th>
                                            <td>
                                                {formatNumber(source.clicks)}
                                            </td>
                                            <td>
                                                {formatNumber(source.users)}
                                            </td>
                                        </tr>
                                    ))}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
