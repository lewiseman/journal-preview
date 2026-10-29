import React, { forwardRef } from "react";

// react-pageflip needs every page to be a ref-forwarding element with the "page" class
const Page = forwardRef(({ number, children }, ref) => (
    <div className="page" ref={ref}>
        <div className="page-content">{children}</div>
        {number && <span className="page-number">{number}</span>}
    </div>
));

Page.displayName = "Page";

export default Page;