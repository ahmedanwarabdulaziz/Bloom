"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowForward, LocalDining, SmokingRooms, Star, Instagram, Facebook } from "@mui/icons-material";
import { MenuItem } from "./admin/menu-items/actions";

interface HomeClientProps {
    featuredItems: MenuItem[];
}

export default function HomeClient({ featuredItems }: HomeClientProps) {
    return (
        <main className="w-full min-h-screen bg-background text-main-text flex flex-col overflow-x-hidden selection:bg-accent-main selection:text-white">
            
            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                        <Image src="/images/general/logo.png" alt="Oasis Logo" fill className="object-contain" />
                    </div>
                    <span className="font-extrabold text-lg tracking-widest uppercase hidden sm:block text-white">Oasis Grill</span>
                </div>
                <nav>
                    <Link href="/menu" className="text-sm font-bold tracking-wider text-white hover:text-accent-main transition-colors px-6 py-2.5 border border-white/10 rounded-full hover:border-accent-main/50 bg-white/5 shadow-sm">
                        MENU
                    </Link>
                </nav>
            </header>

            {/* 1. Hero Section */}
            <section className="relative w-full h-[100dvh] min-h-[600px] flex items-center justify-center pt-16">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <Image 
                        src="/images/general/as2d21w5.png" 
                        alt="Oasis Grill Interior" 
                        fill 
                        priority 
                        className="object-cover scale-[1.05] animate-[pulse_20s_ease-in-out_infinite_alternate]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-w-5xl mx-auto text-center animate-fade-in-up">
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 drop-shadow-2xl mb-6">
                        <Image src="/images/general/logo.png" alt="Oasis Grill Logo" fill className="object-contain" priority />
                    </div>
                    <span className="text-accent-main font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 drop-shadow-md">
                        A TASTE OF THE MEDITERRANEAN IN MISSISSAUGA
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl uppercase leading-[1.1] mb-6">
                        Flame-Grilled. <br className="md:hidden" />
                        <span className="text-accent-main font-light italic">Shisha-Chilled.</span>
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl font-medium tracking-wide drop-shadow-md max-w-2xl mx-auto mb-10">
                        Share mezze, flame-grilled kebabs, and signature mocktails in a beautiful space for families, friends, and celebrations.
                    </p>
                    <Link href="/menu" className="group">
                        <button className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-10 py-4 rounded-full text-lg shadow-[0_8px_32px_rgba(212,175,55,0.2)] flex items-center justify-center transition-all duration-300 hover:bg-accent-main hover:border-accent-main active:scale-[0.98]">
                            <span className="relative z-10 tracking-widest">ENTER OASIS</span>
                            <div className="relative z-10 ml-3 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowForward fontSize="medium" />
                            </div>
                        </button>
                    </Link>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50 hidden md:block">
                    <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                        <div className="w-1.5 h-3 bg-white/60 rounded-full" />
                    </div>
                </div>
            </section>

            {/* 2. About / Concept Section */}
            <section className="relative w-full py-24 px-6 md:px-12 bg-background flex flex-col items-center">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Grilled with care, <span className="text-accent-main">Shared with joy.</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-main to-transparent mx-auto rounded-full opacity-50" />
                    <p className="text-lg md:text-2xl text-muted-text leading-relaxed font-light">
                        Great food starts with fresh halal ingredients, balanced marinades, and real charcoal. From juicy kebabs and Shish Tawook to tender lamb chops and golden wings, served with house-made dips, bright salads, and refreshing juices.
                    </p>
                    <p className="text-base md:text-xl text-muted-text/80 leading-relaxed font-light mt-4">
                        Oasis Grill is the new spot in town. Warm service, a modern-classic dining room, and an oasis-like shisha lounge set the mood. Fire-kissed flavors, mellow nights, and moments you’ll want to repeat.
                    </p>
                </div>
            </section>

            {/* 2.5 Signature Dishes Showcase (Dynamic from Database) */}
            {featuredItems.length > 0 && (
                <section className="relative w-full py-24 bg-background border-t border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Our Masterpieces</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-main to-transparent mx-auto rounded-full opacity-50" />
                        </div>
                    </div>
                    
                    {/* Auto-Scrolling Marquee Container */}
                    <div className="relative w-full flex overflow-hidden">
                        {/* Gradient Fades for edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                        
                        {/* Scrolling Track */}
                        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                            {/* We repeat the items 4 times to ensure it scrolls infinitely regardless of screen width */}
                            {[...Array(4)].map((_, groupIdx) => (
                                <div key={groupIdx} className="flex gap-6 md:gap-10 px-3 md:px-5">
                                    {featuredItems.map((item, index) => (
                                        <Link href="/menu" key={`${groupIdx}-${item.id}`} className="group relative w-72 md:w-[400px] h-[350px] md:h-[450px] shrink-0 rounded-card overflow-hidden cursor-pointer shadow-xl border border-white/5">
                                            <Image src={item.heroImage || item.squareImage || '/images/general/01.png'} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide">{item.name}</h3>
                                                {item.description && (
                                                    <p className="text-white/80 text-xs md:text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-accent-main font-bold text-lg md:text-xl">${item.price.toFixed(2)}</span>
                                                    <span className="text-white/60 text-xs md:text-sm uppercase tracking-widest font-bold group-hover:text-accent-main transition-colors">Order Now &rarr;</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Highlights Grid */}
            <section className="relative w-full py-20 px-6 md:px-12 bg-surface border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="flex flex-col text-center rounded-[var(--radius-card)] glass border border-white/5 hover:border-accent-main/30 transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]">
                            <div className="relative w-full h-56 md:h-64 overflow-hidden bg-background">
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
                                <Image src="/images/general/01.png" alt="Charcoal Grill & Mezze" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 pt-6 relative z-20 bg-surface">
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-accent-main transition-colors duration-300">Charcoal Grill &amp; Mezze</h3>
                                <p className="text-muted-text text-base leading-relaxed">
                                    Flame-kissed kebabs, Shish Tawook, and smoky moutabal. Cucumber-mint tzatziki, Yalangy, Haydari, Charred Shrimp, plus our Full Char-Roasted Chicken.
                                </p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="flex flex-col text-center rounded-[var(--radius-card)] glass border border-white/5 hover:border-accent-main/30 transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]">
                            <div className="relative w-full h-56 md:h-64 overflow-hidden bg-background">
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
                                <Image src="/images/general/02.png" alt="Oasis Shisha Lounge" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 pt-6 relative z-20 bg-surface">
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-accent-main transition-colors duration-300">Oasis Shisha Lounge</h3>
                                <p className="text-muted-text text-base leading-relaxed">
                                    An oasis-style lounge with a gentle fountain. Settle in with signature mocktails and light bites as the night slows to easy conversation and unhurried comfort.
                                </p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="flex flex-col text-center rounded-[var(--radius-card)] glass border border-white/5 hover:border-accent-main/30 transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]">
                            <div className="relative w-full h-56 md:h-64 overflow-hidden bg-background">
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
                                <Image src="/images/general/03.png" alt="Groups & Celebrations" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-8 pt-6 relative z-20 bg-surface">
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-accent-main transition-colors duration-300">Groups &amp; Celebrations</h3>
                                <p className="text-muted-text text-base leading-relaxed">
                                    A spacious dining room and patio for dinners, birthdays, and meetups. Flexible seating, warm service, and catering support so planning is simple.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.5 The Oasis Experience Gallery */}
            <section className="relative w-full py-20 bg-background border-t border-white/5 overflow-hidden">
                <div className="text-center mb-12 relative z-10 px-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">The Oasis Experience</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-main to-transparent mx-auto rounded-full opacity-50" />
                </div>
                
                {/* Marquee Container */}
                <div className="relative w-full flex overflow-hidden">
                    {/* Gradient Fades for edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-background to-transparent z-10" />
                    
                    {/* Scrolling Track */}
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                        {/* We repeat the images twice so it scrolls infinitely without empty space */}
                        {[...Array(2)].map((_, groupIdx) => (
                            <div key={groupIdx} className="flex gap-4 md:gap-8 px-2 md:px-4">
                                <div className="relative w-64 h-40 md:w-[450px] md:h-[300px] rounded-card overflow-hidden group border border-white/5">
                                    <Image src="/images/general/01.png" alt="Gallery 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="relative w-64 h-40 md:w-[450px] md:h-[300px] rounded-card overflow-hidden group border border-white/5">
                                    <Image src="/images/general/02.png" alt="Gallery 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="relative w-64 h-40 md:w-[450px] md:h-[300px] rounded-card overflow-hidden group border border-white/5">
                                    <Image src="/images/general/as2d21w5.png" alt="Gallery 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="relative w-64 h-40 md:w-[450px] md:h-[300px] rounded-card overflow-hidden group border border-white/5">
                                    <Image src="/images/general/03.png" alt="Gallery 4" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Footer */}
            <footer className="w-full py-16 px-6 bg-black text-center flex flex-col items-center border-t border-white/10">
                <div className="relative w-28 h-28 opacity-40 mb-8 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                    <Image src="/images/general/logo.png" alt="Oasis Grill" fill className="object-contain" />
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium tracking-widest text-muted-text uppercase">
                    <Link href="/menu" className="hover:text-accent-main transition-colors">Menu</Link>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <a href="https://maps.app.goo.gl/EoLi6fnJk13kKSUWA" target="_blank" rel="noopener noreferrer" className="hover:text-accent-main transition-colors">Location</a>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <Link href="#" className="hover:text-accent-main transition-colors">Contact</Link>
                </div>
                {/* Social Links */}
                <div className="flex gap-4 mb-8">
                    <a href="https://www.instagram.com/oasisgrill.mississauga" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-accent-main hover:text-black hover:scale-110 transition-all duration-300">
                        <Instagram fontSize="small" />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61581911354787" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-accent-main hover:text-black hover:scale-110 transition-all duration-300">
                        <Facebook fontSize="small" />
                    </a>
                </div>
                <p className="text-muted-text/80 text-sm tracking-widest uppercase mb-4">
                    33 Hillcrest Ave, Mississauga, ON L5B 1K5
                </p>
                <p className="text-muted-text/50 text-xs tracking-wider">
                    &copy; {new Date().getFullYear()} OASIS GRILL. ALL RIGHTS RESERVED.
                </p>
            </footer>

        </main>
    );
}
