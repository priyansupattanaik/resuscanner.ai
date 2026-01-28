import React from "react";

const Background = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1]"
      aria-hidden="true"
    >
      {/* Base color */}
      <div className="absolute inset-0 bg-[#FDFBF7]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};

export default Background;
