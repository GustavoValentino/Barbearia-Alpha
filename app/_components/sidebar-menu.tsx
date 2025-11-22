"use client";

import { authClient } from "@/lib/auth-client";
import {
  CalendarDaysIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  ScissorsIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SheetClose } from "./ui/sheet";
import { toast } from "sonner";

const quickSearchOptions = [
  { label: "Cabelo", value: "cabelo" },
  { label: "Barba", value: "barba" },
  { label: "Acabamento", value: "acabamento" },
  { label: "Pézinho", value: "pézinho" },
  { label: "Sobrancelha", value: "sobrancelha" },
  { label: "Progressiva", value: "progressiva" },
];

const SidebarMenu = () => {
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
    <div className="bg-card flex h-full flex-col justify-between overflow-y-auto">
      <div className="flex flex-col">
        <div className="bg-secondary/10 p-6">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Avatar className="border-primary/20 h-12 w-12 border-2">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-foreground text-base font-bold">
                  {session.user.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {session.user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
                  <UserCircleIcon className="text-muted-foreground size-6" />
                </div>
                <p className="text-foreground font-semibold">
                  Olá, faça seu login!
                </p>
              </div>

              <SheetClose asChild>
                <Button
                  onClick={handleLogin}
                  className="w-full justify-center gap-2 font-bold shadow-md"
                >
                  <LogInIcon className="size-4" />
                  Entrar com Google
                </Button>
              </SheetClose>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-5">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start gap-3 px-2 text-left font-medium"
              asChild
            >
              <Link href="/">
                <HomeIcon className="text-primary size-5" />
                Início
              </Link>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start gap-3 px-2 text-left font-medium"
              asChild
            >
              <Link href="/bookings">
                <CalendarDaysIcon className="text-primary size-5" />
                Agendamentos
              </Link>
            </Button>
          </SheetClose>
        </div>

        <div className="px-5">
          <Separator />
        </div>

        <div className="flex flex-col p-5">
          <h3 className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
            Busca Rápida
          </h3>
          <div className="flex flex-col gap-1">
            {quickSearchOptions.map((option) => (
              <SheetClose key={option.value} asChild>
                <Button
                  variant="ghost"
                  className="text-foreground/80 hover:text-primary h-9 justify-start gap-3 px-2 text-left font-normal"
                  asChild
                >
                  <Link href={`/barbershops?search=${option.value}`}>
                    <ScissorsIcon className="text-muted-foreground/50 size-4" />
                    {option.label}
                  </Link>
                </Button>
              </SheetClose>
            ))}
          </div>
        </div>
      </div>

      {session?.user && (
        <div className="flex flex-col p-5">
          <Separator className="mb-4" />
          <SheetClose asChild>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <LogOutIcon className="size-4" />
              <span className="font-medium">Sair da conta</span>
            </Button>
          </SheetClose>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
