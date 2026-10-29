import React from "react";
import Page from "./Page";

const GoalsPage = React.forwardRef(({ period, items, number }, ref) => (
    <Page ref={ref} number={number}>
        <small>{period} goals</small>
        <h2>{period === "Daily" ? "Today" : period === "Weekly" ? "This week" : "This month"}</h2>
        <ul className="goals">
            {items.map(({ label, progress }) => (
                <li key={label}>
                    <span>{label}</span>
                    <progress value={progress} max="100" aria-label={`${label}: ${progress}%`} />
                </li>
            ))}
        </ul>
    </Page>
));

GoalsPage.displayName = "GoalsPage";

export default GoalsPage;