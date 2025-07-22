import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Nav() {
  return (
    <div className="w-full bg-white border-b py-4">
      <div className="max-w-6xl mx-auto px-4">
        <NavigationMenu className="mx-auto relative">
          <NavigationMenuList className="flex">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="text-primary">Task Manager</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {/* Tasks - Dropdown Menu */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/tasks" className="text-primary">Tasks</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {/* Analytics - Simple Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/profile" className="text-primary">Profile</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}