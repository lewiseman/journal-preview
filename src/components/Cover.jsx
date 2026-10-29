import React, { forwardRef } from "react";

const Cover = forwardRef(({ children }, ref) => (
    <div className="page cover" ref={ref} data-density="hard">
        <div className="page-content">{children}</div>
    </div>
));

Cover.displayName = "Cover";

export default Cover;