import Image from "next/image";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import QuickSearchButtons from "./_components/quick-search-buttons";
import BarbershopItem from "./_components/barbershop-item";
import Footer from "./_components/footer";
import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";
import banner from "../public/banner02.png";
import { Button } from "./_components/ui/button";
import { MessageCircle } from "lucide-react";

const Home = async () => {
  const [recommendedBarbershops, popularBarbershops] = await Promise.all([
    prisma.barbershop.findMany({
      orderBy: { name: "asc" },
      take: 10,
    }),
    prisma.barbershop.findMany({
      orderBy: { name: "desc" },
      take: 10,
    }),
  ]);

  const { data: session } = await authClient.getSession();

  const currentDate = format(new Date(), "EEEE, d 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl">
        <PageContainer>
          <div className="flex flex-col gap-6 py-6 lg:gap-12">
            <div className="space-y-1">
              <h2 className="text-foreground text-xl font-bold">
                {session?.user
                  ? `Olá, ${session.user.name?.split(" ")[0]}!`
                  : "Olá, bem-vindo!"}
              </h2>
              <p className="text-muted-foreground text-sm capitalize">
                {currentDate}
              </p>
            </div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
              <div className="relative order-1 h-[250px] w-full overflow-hidden rounded-xl shadow-lg lg:h-[350px]">
                <div className="absolute inset-0 z-10 rounded-xl bg-linear-to-t from-black to-transparent" />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white lg:p-16">
                  <Link href="/chat" className="inline-block w-full sm:w-fit">
                    <Button className="bg-primary hover:bg-primary/90 shadow-primary/30 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-base font-semibold text-white shadow-lg transition-colors duration-200 sm:w-auto">
                      Agende pelo chat
                      <MessageCircle className="ml-2 size-5" />
                    </Button>
                  </Link>
                </div>

                <Image
                  src={banner}
                  alt="Agende nos melhores com a Aparatus"
                  fill
                  className="rounded-xl object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              <div className="order-2 flex flex-col gap-4">
                <SearchInput />
                <QuickSearchButtons />
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12">
            <PageSection>
              <PageSectionTitle>Recomendados para você</PageSectionTitle>
              <PageSectionScroller>
                {recommendedBarbershops.map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
              </PageSectionScroller>
            </PageSection>

            <PageSection>
              <PageSectionTitle>Populares</PageSectionTitle>
              <PageSectionScroller>
                {popularBarbershops.map((barbershop) => (
                  <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
              </PageSectionScroller>
            </PageSection>
          </div>
        </PageContainer>
      </div>
      <Footer />
    </main>
  );
};

export default Home;
