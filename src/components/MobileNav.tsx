import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavContent from "./NavContent";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-600"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      {/* Side="left" makes it slide from the left */}
      <SheetContent
        side="left"
        className="p-0 w-80 bg-slate-50 border-r-slate-200"
      >
        <NavContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
