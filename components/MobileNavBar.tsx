"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { CiMenuFries } from "react-icons/ci";
import MainNav from "./MainNav";

const MobileNavBar = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <CiMenuFries className="size-5" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <DrawerContent className="mx-auto w-full max-w-sm">
          <DrawerClose>
            <MainNav />
          </DrawerClose>
        </DrawerContent>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavBar;
