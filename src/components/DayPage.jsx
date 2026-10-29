import React from "react";
import Page from "./Page";

const DayPage = React.forwardRef(({ date, title, notes, photo, caption, number }, ref) => (
    <Page ref={ref} number={number}>
        <small>{date}</small>
        <h2>{title}</h2>
        <figure>
            {photo ? <img src={photo} alt={caption} /> : <div className="photo">Photo from your day</div>}
            <figcaption>{caption}</figcaption>
        </figure>
        <ul>
            {notes.map((note) => (
                <li key={note}>{note}</li>
            ))}
        </ul>
    </Page>
));

DayPage.displayName = "DayPage";

export default DayPage;