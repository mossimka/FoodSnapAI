import { Variants, easeOut } from 'framer-motion';

export const containerVariants: Variants = {
    hidden: { 
        opacity: 0,
        y: 50
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easeOut,
            staggerChildren: 0.2
        }
    }
};

export const itemVariants: Variants = {
    hidden: { 
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easeOut
        }
    }
};