"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityAnalytics() {
    useEffect(() => {
        // Initialize Microsoft Clarity
        Clarity.init("yj6hdgnk0v");
    }, []);

    return null;
}
