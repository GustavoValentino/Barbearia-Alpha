"use client";
import { Barbershop } from "../generated/prisma/client";
import { Card } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import Link from "next/link";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Link
      href={`/barbershops/${barbershop.id}`}
      passHref
      className="block max-w-[167px] min-w-[167px] lg:max-w-[220px] lg:min-w-[220px]"
    >
      <Card className="border-secondary hover:shadow-primary/20 h-full overflow-hidden rounded-2xl p-0 transition-shadow duration-200 hover:shadow-lg">
        <div className="relative h-[220px] w-full">
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 167px, 220px"
          />

          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              className="bg-secondary/90 hover:bg-secondary flex items-center gap-1 opacity-90 backdrop-blur-[2px]"
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs font-semibold">5.0</span>
            </Badge>
          </div>

          <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-20 p-3 text-white">
            <h3 className="truncate text-base leading-tight font-bold">
              {barbershop.name}
            </h3>
            <p className="truncate text-xs font-medium opacity-90">
              {barbershop.address}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BarbershopItem;
