import { Menu as MenuIcon, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { menuItems } from "@/config/menu";

const MenuButton = () => {
  return (
    <div className="fixed top-3 right-5 z-50">
      <Sheet>
        <SheetTrigger>
          <div className="border-gray-800 text-white border bg-[#030712] p-2 rounded-md shadow-md hover:shadow-lg transition duration-200 ease-in-out">
            <MenuIcon size={20} strokeWidth={1} />
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl p-3">Menu</SheetTitle>
            <SheetDescription>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer text-lg"
                >
                  <a href={item.href}>
                    <ChevronRight size={15} strokeWidth={1} />
                    <span>{item.title}</span>
                  </a>
                </div>
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuButton;
