import React from "react";
import NavContent from "./NavContent";

const Sidebar = () => {
  return (
    <div className="w-72 border-r-2 border-black flex-shrink-0 h-screen sticky top-0 hidden md:block bg-background">
      <NavContent />
    </div>
  );
};

export default Sidebar;
