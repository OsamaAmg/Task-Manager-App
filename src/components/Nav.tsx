import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { CheckCircle2 } from "lucide-react";

export default function Nav() {
  return (
    <div className="w-full bg-white border-b py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center">
          {/* Logo at far left */}
          <Link
            href="/Dashboard"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xl font-semibold">TaskFlow</span>
          </Link>

          {/* Navigation Menu pushed right */}
          <div className="ml-auto">
            <NavigationMenu>
              <NavigationMenuList className="flex">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/tasks" className="text-primary font-medium">
                      My tasks
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/profile" className="text-primary font-medium">
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
