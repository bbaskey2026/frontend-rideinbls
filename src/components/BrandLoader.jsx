import React, { useEffect, useState } from "react";
import "./BrandLoader.css";

export default function BrandLoader({
  name = "RideInBls",
  caption = "Loading, please wait...",
  overlay = true,
  textColor = "#000",
  size = "clamp(36px, 6vw, 64px)"
}) {
  const letters = name.split("");
  const [active, setActive] = useState(Array(letters.length).fill(false));

  useEffect(() => {
    letters.forEach((_, i) => {
      setTimeout(() => {
        setActive((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 100);
    });
  }, [name]);

  return (
    <div className={`loader-wrap ${overlay ? "overlay" : ""}`} style={{ color: textColor }}>
      <div className="loader-box">
        {/* Brand Name Animation */}
        <div className="brand" style={{ fontSize: size }}>
          {letters.map((ch, i) => (
            <span key={i} className={active[i] ? "show" : ""}>
              {ch}
            </span>
          ))}
        </div>

        {/* Caption */}
        <div className="caption">{caption}</div>

        {/* Circular Spinner */}
        <div className="circle-loader">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
}
