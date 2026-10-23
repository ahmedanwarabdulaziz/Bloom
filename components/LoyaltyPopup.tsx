"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowBack, Close, Stars } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Clarity from "@microsoft/clarity";
import type { LoyaltySettings } from "../app/admin/settings/actions";
import { trackLoyaltyEvent, LoyaltyEvent } from "../app/menu/tracking";

const POPUP_DELAY_MS = 1500;
const SQUARE_RENDER_DELAY_MS = 2000;
const NFC_SOURCE = "nfc";
const KEY_LAST_VISIT = "bloom_last_visit_day";
const KEY_POPUP_SHOWN = "bloom_loyalty_popup_day";
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

export default function LoyaltyPopup({ settings }: { settings: LoyaltySettings }) {
    const [open, setOpen] = useState(false);
    // Square's page opens in an in-page panel so customers never leave the menu.
    const [squareOpen, setSquareOpen] = useState(false);
    const [squareLoading, setSquareLoading] = useState(true);

    useEffect(() => {
        const day = today();

        // Only visits from the NFC tag link (/menu?src=nfc) count as menu opens.
        const url = new URL(window.location.href);
        if (url.searchParams.get("src") === NFC_SOURCE) {
            const firstVisitToday = storageGet(KEY_LAST_VISIT) !== day;
            storageSet(KEY_LAST_VISIT, day);
            track("menu_open", firstVisitToday);
            // Drop the tag so refreshes and shared links don't count as scans.
            url.searchParams.delete("src");
            window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
        }

        if (!settings.popupEnabled || !settings.squareLink) return;
        if (storageGet(KEY_JOINED) || storageGet(KEY_POPUP_SHOWN) === day) return;

        const timer = setTimeout(() => {
            setOpen(true);
            storageSet(KEY_POPUP_SHOWN, day);
            track("popup_shown");
        }, POPUP_DELAY_MS);
        return () => clearTimeout(timer);
    }, [settings.popupEnabled, settings.squareLink]);

    const handleJoin = () => {
        track("popup_join");
        storageSet(KEY_JOINED, "1");
        setOpen(false);
        openSquare();
    };

    const handlePoints = () => {
        track("points_click");
        openSquare();
    };

    const openSquare = () => {
        setSquareLoading(true);
        setSquareOpen(true);
    };

    const handleSkip = () => {
        track("popup_skip");
        setOpen(false);
    };

    return (
        <>
            {settings.pointsButtonEnabled && settings.squareLink && (
                <button
                    onClick={handlePoints}
                    className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-accent-main text-background font-bold text-sm px-4 py-3 rounded-full shadow-xl border border-accent-main-hover active:scale-95 transition-transform"
                >
                    <Stars fontSize="small" />
                    {settings.pointsButtonText}
                </button>
            )}

            <AnimatePresence>
                {squareOpen && (
                    <motion.div
                        key="square-panel"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-[110] bg-background flex flex-col"
                    >
                        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background">
                            <button
                                onClick={() => setSquareOpen(false)}
                                className="flex items-center gap-1.5 bg-accent-main text-background font-bold text-sm px-4 py-2 rounded-full active:scale-95 transition-transform"
                            >
                                <ArrowBack fontSize="small" />
                                Back to menu
                            </button>
                            <a
                                href={settings.squareLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-text text-xs underline"
                            >
                                Not loading? Open here
                            </a>
                        </div>
                        <div className="relative flex-1 w-full bg-white">
                            <iframe
                                src={settings.squareLink}
                                title="Bloom Rewards"
                                // Square's page fires load before its app has drawn anything, so keep the spinner a bit longer.
                                onLoad={() => setTimeout(() => setSquareLoading(false), SQUARE_RENDER_DELAY_MS)}
                                className="absolute inset-0 w-full h-full border-0"
                            />
                            {squareLoading && (
                                <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center gap-3 text-gray-500 text-sm">
                                    <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-[#224735] animate-spin" />
                                    Loading Bloom Rewards...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="loyalty-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleSkip}
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
                                onClick={handleSkip}
                                aria-label="Close"
                                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/70 border border-border flex items-center justify-center text-main-text active:scale-95"
                            >
                                <Close fontSize="small" />
                            </button>

                            {settings.image ? (
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
                                    {settings.title}
                                </h2>
                                <p className="text-muted-text text-sm mt-3 leading-relaxed whitespace-pre-line">
                                    {settings.description}
                                </p>

                                <button
                                    onClick={handleJoin}
                                    className="mt-6 block w-full bg-accent-main hover:bg-accent-main-hover text-background font-bold py-3 rounded-full shadow-md active:scale-95 transition-all"
                                >
                                    {settings.joinButtonText}
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="mt-3 w-full text-muted-text text-sm py-2 hover:text-main-text transition-colors"
                                >
                                    {settings.skipButtonText}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
