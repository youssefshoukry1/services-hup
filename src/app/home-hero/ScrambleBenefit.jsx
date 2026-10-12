"use client";

import { useEffect, useRef, useState } from "react";
import { DESKTOP_MOTION_QUERY } from "./desktop-motion";

export default function ScrambleBenefit({ number, children }) {
  const [label, setLabel] = useState(children);
  const timer = useRef(null);
  const eligible = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION_QUERY);
    const update = () => {
      eligible.current = media.matches;
      clearInterval(timer.current);
      timer.current = null;
      setLabel(children);
    };
    update();
    media.addEventListener("change", update);
    return () => { clearInterval(timer.current); media.removeEventListener("change", update); };
  }, [children]);

  const scramble = () => {
    if (!eligible.current || timer.current) return;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let iterations = 0;
    timer.current = setInterval(() => {
      setLabel(children.split("").map((letter, index) => index < iterations ? letter : alphabet[Math.floor(Math.random() * alphabet.length)]).join(""));
      if (iterations >= children.length) { clearInterval(timer.current); timer.current = null; }
      iterations += 1 / 4;
    }, 40);
  };

  return <span onMouseEnter={scramble}><b>{number}</b><span aria-label={children}><span aria-hidden="true">{label}</span></span></span>;
}
