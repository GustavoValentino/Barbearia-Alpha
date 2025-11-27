"use client";

import Image from "next/image";
import { BarbershopService, Barbershop } from "../generated/prisma/client";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { useAction } from "next-safe-action/hooks";
import { createBooking } from "../_actions/create-booking";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getDateAvailableTimeSlots } from "../_actions/get-date-available-time-slots";
import { createBookingCheckoutSession } from "../_actions/create-booking-checkout-session";
import { loadStripe } from "@stripe/stripe-js";

interface ServiceItemProps {
  service: BarbershopService & {
    barbershop: Barbershop;
  };
}

export function ServiceItem({ service }: ServiceItemProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { isPending } = useAction(createBooking);
  const { executeAsync: executeCreateBookingCheckoutSession } = useAction(
    createBookingCheckoutSession,
  );
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { data: availableTimeSlots } = useQuery({
    queryKey: ["date-available-time-slots", service.barbershopId, selectedDate],
    queryFn: () =>
      getDateAvailableTimeSlots({
        barbershopId: service.barbershopId,
        date: selectedDate!,
      }),
    enabled: Boolean(selectedDate),
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const isConfirmDisabled = !selectedDate || !selectedTime;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleConfirm = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      toast.error("Erro ao criar checkout session");
      return;
    }
    if (!selectedTime || !selectedDate) {
      return;
    }
    const timeSplitted = selectedTime.split(":"); // [10, 00]
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];
    const date = new Date(selectedDate);
    date.setHours(Number(hours), Number(minutes));
    const checkoutSessionResult = await executeCreateBookingCheckoutSession({
      serviceId: service.id,
      date,
    });
    if (
      checkoutSessionResult.serverError ||
      checkoutSessionResult.validationErrors
    ) {
      toast.error(checkoutSessionResult.validationErrors?._errors?.[0]);
      return;
    }
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    );
    if (!stripe || !checkoutSessionResult.data?.id) {
      toast.error("Erro ao carregar Stripe");
      return;
    }
    await stripe.redirectToCheckout({
      sessionId: checkoutSessionResult.data.id,
    });
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div className="w-full max-w-4xl lg:mx-auto">
        <div className="border-border bg-card flex w-full items-center gap-3 rounded-2xl border border-solid p-3">
          <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex grow basis-0 flex-row items-center self-stretch">
            <div className="relative flex h-full min-h-0 min-w-0 grow basis-0 flex-col items-start justify-between">
              <div className="flex h-[67.5px] w-full flex-col items-start gap-1 text-sm leading-[1.4]">
                <p className="text-card-foreground w-full truncate font-bold">
                  {service.name}
                </p>

                <p className="text-muted-foreground line-clamp-2 w-full font-normal">
                  {service.description}
                </p>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="text-card-foreground shrink-0 text-sm leading-[1.4] font-bold whitespace-pre">
                  {priceInReais}
                </p>
                <SheetTrigger asChild>
                  <Button className="h-8 shrink-0 rounded-full px-3 py-1 text-xs">
                    Reservar
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SheetContent className="w-full max-w-[400px] overflow-y-auto p-0 lg:max-w-xl lg:rounded-l-xl">
        <div className="flex h-full flex-col gap-6">
          <SheetHeader className="px-5 pt-6">
            <SheetTitle className="text-lg font-bold">Fazer Reserva</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 lg:mx-auto lg:w-full lg:max-w-md">
            <div className="flex flex-col gap-4 px-5 lg:px-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ before: today }}
                className="mx-auto w-fit p-0"
                locale={ptBR}
                classNames={{
                  month: "space-y-4 lg:w-full lg:mx-auto",
                  caption: "flex justify-center pt-1 relative items-center",
                  head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] lg:w-10",
                  cell: "h-9 w-9 text-center text-sm p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 lg:h-10 lg:w-10",
                }}
              />
            </div>

            {selectedDate && (
              <>
                <Separator className="lg:hidden" />
                <div className="flex flex-wrap justify-center gap-3 overflow-x-auto px-5 lg:px-0 [&::-webkit-scrollbar]:hidden">
                  {availableTimeSlots?.data?.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="shrink-0 rounded-full px-4 py-2"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Separator />

                <div className="flex flex-col gap-3 px-5 lg:px-0">
                  <div className="border-border bg-card-foreground/5 flex w-full flex-col gap-3 rounded-[10px] border border-solid p-4 shadow-inner">
                    <div className="flex items-center justify-between">
                      <p className="text-card-foreground text-base font-bold">
                        {service.name}
                      </p>
                      <p className="text-primary text-lg font-extrabold">
                        {priceInReais}{" "}
                      </p>
                    </div>

                    <div className="border-border flex flex-col gap-2 border-t border-solid pt-2">
                      <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <p className="font-medium">Data</p>
                        <p className="text-card-foreground font-semibold">
                          {formattedDate}
                        </p>
                      </div>

                      {selectedTime && (
                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                          <p className="font-medium">Horário</p>
                          <p className="text-card-foreground font-semibold">
                            {selectedTime}
                          </p>
                        </div>
                      )}

                      <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <p className="font-medium">Barbearia</p>
                        <p className="text-card-foreground font-semibold">
                          {service.barbershop.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-6 lg:px-0">
                  <Button
                    className="h-12 w-full cursor-pointer rounded-full text-base"
                    disabled={isConfirmDisabled || isPending}
                    onClick={handleConfirm}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
