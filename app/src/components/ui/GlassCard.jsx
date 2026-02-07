import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={twMerge(
                "glass-card p-6 border border-white/5 bg-secondary/50 backdrop-blur-xl shadow-2xl overflow-hidden relative",
                className
            )}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className={`relative z-10 h-full flex flex-col`}>
                {children}
            </div>
        </motion.div>
    );
};
