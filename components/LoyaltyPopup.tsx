"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Close, Stars } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Clarity from "@microsoft/clarity";
import type { LoyaltySettings } from "../app/admin/settings/actions";
import { trackLoyaltyEvent, LoyaltyEvent } from "../app/menu/tracking";

const POPUP_DELAY_MS = 1500;
const NFC_SOURCE = "nfc";
const KEY_LAST_VISIT = "bloom_last_visit_day";
const KEY_JOINED = "bloom_loyalty_joined";

const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || "https://pub-03f42476f4324996812e6d8a983be0f0.r2.dev";

// Uploads may store only the R2 key instead of a full URL.
const resolveImageUrl = (src: string) =>
    /^https?:\/\//.test(src) ? src : `${R2_DOMAIN}/${src.replace(/^\/+/, "")}`;

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());

// localStorage can throw in private mode; treat that as nothing stored.
const storageGet = (key: string) => {
    try { return localStorage.getItem(key); } catch { return null; }
};
const storageSet = (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
};

const track = (event: LoyaltyEvent, firstVisitToday = false) => {
    trackLoyaltyEvent(event, firstVisitToday);
    try { Clarity.event(event); } catch { /* Clarity not ready */ }
};

// "signup" for phones that never tapped Join, "welcome" for phones that did.
type PopupMode = "signup" | "welcome";

export default function LoyaltyPopup({ settings }: { settings: LoyaltySettings }) {
    const [mode, setMode] = useState<PopupMode | null>(null);

    // Remembered across effect re-runs, because the first run strips ?src=nfc from the URL.
    const isNfcScan = useRef<boolean | null>(null);

    useEffect(() => {
        // Popups and menu-open counts only happen on NFC tag visits (/menu?src=nfc).
        if (isNfcScan.current === null) {
            const url = new URL(window.location.href);
            isNfcScan.current = url.searchParams.get("src") === NFC_SOURCE;
            if (isNfcScan.current) {
                const day = today();
                const firstVisitToday = storageGet(KEY_LAST_VISIT) !== day;
                storageSet(KEY_LAST_VISIT, day);
                track("menu_open", firstVisitToday);
                // Drop the tag so refreshes and shared links don't count as scans or reopen the popup.
                url.searchParams.delete("src");
                window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
            }
        }

        if (!isNfcScan.current || !settings.popupEnabled || !settings.squareLink) return;

        const nextMode: PopupMode = storageGet(KEY_JOINED) ? "welcome" : "signup";
        const timer = setTimeout(() => {
            setMode(nextMode);
            track(nextMode === "signup" ? "popup_shown" : "welcome_shown");
        }, POPUP_DELAY_MS);
        return () => clearTimeout(timer);
    }, [settings.popupEnabled, settings.squareLink]);

    const handlePrimary = () => {
        if (mode === "signup") {
            track("popup_join");
            storageSet(KEY_JOINED, "1");
        } else {
            track("points_click");
        }
        setMode(null);
    };

    const handleDismiss = () => {
        if (mode === "signup") track("popup_skip");
        setMode(null);
    };

    const content = mode === "welcome"
        ? {
            title: settings.welcomeTitle,
            description: settings.welcomeDescription,
            primary: settings.welcomeButtonText,
            dismiss: "Back to menu",
        }
        : {
            title: settings.title,
            description: settings.description,
            primary: settings.joinButtonText,
            dismiss: settings.skipButtonText,
        };

    return (
        <>
            {settings.pointsButtonEnabled && settings.squareLink && (
                // Square opens in a new tab: Safari blocks Square's login cookies inside an embedded frame,
                // which breaks the SMS code step on iPhones. The menu stays open in the original tab.
                <a
                    href={settings.squareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("points_click")}
                    className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-accent-main text-background font-bold text-sm px-4 py-3 rounded-full shadow-xl border border-accent-main-hover active:scale-95 transition-transform"
                >
                    <Stars fontSize="small" />
                    {settings.pointsButtonText}
                </a>
            )}

            <AnimatePresence>
                {mode && (
                    <motion.div
                        key="loyalty-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="loyalty-title"
                            className="relative w-full max-w-sm bg-surface border border-border rounded-card shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={handleDismiss}
                                aria-label="Close"
                                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/70 border border-border flex items-center justify-center text-main-text active:scale-95"
                            >
                                <Close fontSize="small" />
                            </button>

                            {mode === "signup" && settings.image ? (
                                <div className="relative w-full aspect-[16/9] bg-surface-elevated">
                                    <Image src={resolveImageUrl(settings.image)} alt="" fill sizes="384px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-full pt-8 flex justify-center text-accent-main">
                                    <Stars style={{ fontSize: 56 }} />
                                </div>
                            )}

                            <div className="p-6 text-center">
                                <h2 id="loyalty-title" className="text-main-text font-bold text-2xl leading-tight">
                                    {content.title}
                                </h2>
                                <p className="text-muted-text text-sm mt-3 leading-relaxed whitespace-pre-line">
                                    {content.description}
                                </p>

                                <a
                                    href={settings.squareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handlePrimary}
                                    className="mt-6 block w-full bg-accent-main hover:bg-accent-main-hover text-background font-bold py-3 rounded-full shadow-md active:scale-95 transition-all"
                                >
                                    {content.primary}
                                </a>
                                <button
                                    onClick={handleDismiss}
                                    className="mt-3 w-full text-muted-text text-sm py-2 hover:text-main-text transition-colors"
                                >
                                    {content.dismiss}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
