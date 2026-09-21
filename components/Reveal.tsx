'use client'

import React from 'react';
import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds, applied on top of the base transition. */
  delay?: number;
  /** Distance (px) the element travels in from. Ignored when direction is 'none'. */
  y?: number;
  /** Which direction the element enters from. Defaults to 'up'. */
  direction?: Direction;
  /** Animation duration in seconds. */
  duration?: number;
  /** Fraction of the element that must be visible before it animates in. */
  amount?: number;
  /** Replay the animation every time the element re-enters the viewport. */
  once?: boolean;
  /** Element/component to render as. Defaults to 'div'. */
  as?: 'div' | 'li';
}

const getOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    case 'none':
    default:
      return { x: 0, y: 0 };
  }
};

const Reveal = ({
  children,
  className,
  delay = 0,
  y = 24,
  direction = 'up',
  duration = 0.55,
  amount = 0.2,
  once = true,
  as = 'div',
}: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const offset = getOffset(direction, y);

  const variants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01, delay: 0 } },
      }
    : {
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          } as Transition,
        },
      };

  const MotionTag = as === 'li' ? motion.li : motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
