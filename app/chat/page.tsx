"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "./_components/chat-message";
import { ChatInput } from "./_components/chat-input";

const INITIAL_MESSAGES = [
  {
    id: "system-welcome",
    role: "system" as const,
    parts: [
      {
        type: "text" as const,
        text: "Seu assistente de agendamentos está online.",
      },
    ],
  },
  {
    id: "assistant-welcome",
    role: "assistant" as const,
    parts: [
      {
        type: "text" as const,
        text: "Olá! Sou o Aparatus, seu assistente pessoal.\n\nEstou aqui para te auxiliar a agendar seu corte ou barba, encontrar as barbearias disponíveis perto de você e responder às suas dúvidas.",
      },
    ],
  },
];

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({
        text: message,
      });
      setMessage("");
    }
  };

  const isLoading = status === "streaming" || status === "submitted";

  const allMessages = messages.length === 0 ? INITIAL_MESSAGES : messages;

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col overflow-hidden bg-[var(--background)]">
      {/* HEADER FIXO */}
      <div className="border-border/50 sticky top-0 z-10 flex items-center justify-between border-b bg-[var(--background)] px-5 py-4 shadow-sm">
        <Link href="/">
          <ChevronLeft className="size-6 shrink-0 text-[var(--foreground)]" />
        </Link>
        <p className="text-xl font-bold tracking-[-1px] text-nowrap whitespace-pre text-[var(--foreground)] italic">
          Aparatus
        </p>

        <div className="size-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-4">
          {allMessages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isStreaming={
                status === "streaming" &&
                index === messages.length - 1 &&
                msg.role === "assistant"
              }
            />
          ))}

          {isLoading &&
            allMessages.length > 0 &&
            allMessages[allMessages.length - 1].role === "user" && (
              <div className="flex w-full items-center justify-start">
                <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Loader2 className="text-primary size-4 animate-spin" />
                </div>
                <div className="bg-muted text-foreground ml-3 rounded-xl rounded-tl-sm px-4 py-2 text-sm">
                  Digitando...
                </div>
              </div>
            )}
        </div>
        <div ref={messagesEndRef} className="h-6" />
      </div>

      <ChatInput
        input={message}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
