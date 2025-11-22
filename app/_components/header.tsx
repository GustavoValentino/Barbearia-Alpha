"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  MenuIcon,
  CalendarDaysIcon,
  LogOutIcon,
  LogInIcon,
  MessageCircleIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SidebarMenu from "./sidebar-menu";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Header = () => {
  const { data: session } = authClient.useSession();

  const handleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao sair da conta.");
    }
  };

  return (
    <header className="border-secondary bg-card sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="flex h-[4.5rem] w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center">
          <Link href="/">
            <div className="relative h-[28px] w-[110px] transition-opacity hover:opacity-90">
              <Image
                src="/logo.svg"
                alt="Aparatus"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary gap-2 font-medium"
              asChild
            >
              <Link href="/bookings">
                <CalendarDaysIcon size={18} />
                Agendamentos
              </Link>
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="border-secondary h-9 w-9 sm:h-10 sm:w-10"
            asChild
          >
            <Link href="/chat" title="Chat">
              <MessageCircleIcon
                size={18}
                className="text-primary sm:h-5 sm:w-5"
              />
            </Link>
          </Button>

          <div className="hidden items-center md:flex">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary/50 rounded-full border border-transparent"
                  >
                    <Avatar className="border-secondary h-9 w-9 border">
                      <AvatarImage src={session.user.image ?? ""} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {session.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      <CalendarDaysIcon className="mr-2 size-4" />
                      Meus Agendamentos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20"
                  >
                    <LogOutIcon className="mr-2 size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} className="gap-2 px-6 font-bold">
                <LogInIcon size={18} />
                Entrar
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-secondary h-9 w-9 sm:h-10 sm:w-10"
                >
                  <MenuIcon size={18} className="sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent className="border-l-secondary bg-card w-[85vw] p-0 sm:w-[350px]">
                <SheetHeader className="border-secondary border-b px-5 py-6 text-left">
                  <SheetTitle className="text-foreground text-lg font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <SidebarMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
