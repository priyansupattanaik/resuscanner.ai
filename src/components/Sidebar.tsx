import React from "react";
import NavContent from "./NavContent";

const Sidebar = () => {
  return (
    <div className="w-64 border-r border-slate-200 flex-shrink-0 h-screen sticky top-0 hidden md:block">
      <NavContent />
    </div>
  );
};

export default Sidebar;
