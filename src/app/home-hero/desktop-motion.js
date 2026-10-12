// Large screens with a mouse/trackpad only; touch devices keep native scrolling.
export const DESKTOP_QUERY = "(min-width: 1200px) and (hover: hover) and (pointer: fine)";
export const DESKTOP_MOTION_QUERY = `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`;
