import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import { ServiceItem } from "@/app/_components/service-item";
import { PhoneItem } from "@/app/_components/phone-item";
import Footer from "@/app/_components/footer";
import { Container } from "@/app/_components/ui/container";

const BarbershopPage = async (props: PageProps<"/barbershops/[id]">) => {
  const { id } = await props.params;
  const barbershop = await prisma.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    notFound();
  }

  return (
    <div className="flex size-full flex-col items-start overflow-clip">
      <div className="relative h-[297px] w-full lg:h-[350px]">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute top-0 left-0 flex w-full items-baseline gap-[91px] px-5 pt-6 pb-0">
          <Button
            size="icon"
            variant="secondary"
            className="overflow-clip rounded-full bg-white/70 shadow-md backdrop-blur-sm transition-colors hover:bg-white/90"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      <Container
        maxWidthClass="max-w-2xl"
        className="relative z-10 -mt-10 py-1 lg:py-2"
      >
        <div className="bg-background w-full rounded-tl-3xl rounded-tr-3xl p-6 shadow-xl lg:p-8">
          <div className="flex w-full items-center gap-4">
            <div className="border-primary/20 relative size-[60px] shrink-0 overflow-hidden rounded-full border-2 shadow-lg">
              <Image
                src={barbershop.imageUrl}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-foreground text-2xl font-bold">
                {barbershop.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {barbershop.address}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <p className="text-foreground text-xs font-bold tracking-widest uppercase">
              SOBRE NÓS
            </p>
            <p className="text-foreground w-full text-sm leading-relaxed">
              {barbershop.description}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <p className="text-foreground text-xs font-bold tracking-widest uppercase">
              SERVIÇOS
            </p>
            <div className="flex w-full flex-col gap-3">
              {barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={{ ...service, barbershop }}
                />
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <p className="text-foreground text-xs font-bold tracking-widest uppercase">
              CONTATO
            </p>
            <div className="flex w-full flex-col gap-3">
              {barbershop.phones?.map((phone: string, index: number) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default BarbershopPage;
