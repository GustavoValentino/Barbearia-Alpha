"use client";

import { Mic, Send } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { cn } from "@/lib/utils"; // Assumindo utilitário cn

interface ChatInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const isInputEmpty = !input.trim();
  const isDisabled = isLoading || isInputEmpty;

  return (
    // sticky bottom-0 garante que o input fique sempre visível
    <div className="sticky bottom-0 left-0 flex w-full flex-col gap-2.5 bg-[var(--background)] p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex w-full items-center gap-2">
        {/* Input de Mensagem */}
        <Input
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem"
          className="bg-card border-primary/20 focus-visible:ring-primary h-12 grow basis-0 rounded-full px-4 py-3 text-sm shadow-inner"
          disabled={isLoading}
        />

        {/* Botão de Microfone) */}
        {/* <Button
          size="icon"
          className="bg-secondary text-primary hover:bg-secondary/80 size-12 shrink-0 rounded-full p-2.5 shadow-md"
          disabled 
        >
          <Mic className="size-5" />
        </Button> */}

        {/* Botão de Envio */}
        <Button
          size="icon"
          className={cn(
            "size-12 shrink-0 rounded-full p-2.5 shadow-md transition-all duration-200",
            isDisabled
              ? "bg-muted-foreground/30 cursor-not-allowed text-white/50"
              : "bg-primary hover:bg-primary/90 text-white",
          )}
          onClick={onSubmit}
          disabled={isDisabled}
        >
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
};
