'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LottoBallProps {
    number: number;
    isSpinning: boolean;
    delay?: number;
}

const Reel = ({ number, isSpinning, delay }: { number: number, isSpinning: boolean, delay: number }) => {
    const [displayNumbers, setDisplayNumbers] = useState<number[]>([]);

    useEffect(() => {
        // Generate an array of random numbers for the reel effect
        setDisplayNumbers(Array.from({ length: 15 }, () => Math.floor(Math.random() * 45) + 1));
    }, []);

    return (
        <div className="relative w-16 h-16 md:w-20 md:h-20 glass-morphism rounded-full overflow-hidden flex items-center justify-center border-2 border-white/10 shadow-inner">
            <AnimatePresence mode="wait">
                {isSpinning ? (
                    <motion.div
                        key="spinning"
                        initial={{ y: 0 }}
                        animate={{ y: "-80%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.5,
                            ease: "linear",
                            delay
                        }}
                        className="flex flex-col gap-4"
                    >
                        {displayNumbers.map((num, i) => (
                            <div key={i} className="text-2xl md:text-3xl font-bold opacity-30">
                                {num}
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ y: 200, opacity: 0, filter: "blur(8px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                            type: 'spring',
                            stiffness: 40,      // Very loose spring (slow pull)
                            damping: 20,        // High friction (no bounce)
                            mass: 2             // Heavy mass (slow movement)
                        }}
                        className={cn(
                            "w-full h-full flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg",
                            number === 0 ? "text-muted-foreground/20" :
                                number <= 10 ? "bg-amber-400 text-amber-950" :
                                    number <= 20 ? "bg-blue-400 text-blue-950" :
                                        number <= 30 ? "bg-red-400 text-red-950" :
                                            number <= 40 ? "bg-gray-400 text-gray-950" :
                                                "bg-green-400 text-green-950"
                        )}
                    >
                        {number !== 0 ? number : "?"}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function LottoSlot({
    numbers,
    spinningIndices
}: {
    numbers: number[],
    spinningIndices: number[]
}) {
    return (
        <div className="flex flex-wrap justify-center gap-4 py-12">
            {Array.from({ length: 6 }).map((_, i) => (
                <Reel
                    key={i}
                    number={numbers[i] || 0}
                    isSpinning={spinningIndices.includes(i)}
                    delay={i * 0.05}
                />
            ))}
        </div>
    );
}
