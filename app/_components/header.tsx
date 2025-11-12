"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { MessageCircleIcon } from "lucide-react";

import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-5 py-6">
      <Image src="/logo.svg" alt="Alpha" width={100} height={26.09} />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/chat">
            <MessageCircleIcon />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
