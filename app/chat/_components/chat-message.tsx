import { UIMessage } from "ai";
import { Bot } from "lucide-react";
import { Streamdown } from "streamdown";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export const ChatMessage = ({
  message,
  isStreaming = false,
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const content = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (isSystem) {
    return (
      <div className="flex w-full justify-center px-4">
        <div className="border-border bg-muted/50 max-w-sm rounded-xl border p-2.5 shadow-sm">
          <p className="text-muted-foreground text-center text-xs leading-normal font-medium">
            {content}
          </p>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex w-full justify-end px-4">
        <div className="flex max-w-[80%] flex-col items-end gap-1">
          {/* Balão de Mensagem do Usuário */}
          <div className="bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3 shadow-md">
            <p className="text-sm leading-relaxed font-normal break-words whitespace-normal">
              {content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="flex w-full justify-start px-4">
        <div className="flex max-w-[80%] items-start gap-3">
          {/* Avatar da IA */}
          <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm">
            <Bot className="text-primary size-4" />
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="bg-card text-foreground rounded-xl rounded-tl-sm px-4 py-3 shadow-md">
              <div className="text-sm leading-relaxed font-normal break-words whitespace-normal">
                <Streamdown>{content}</Streamdown>
              </div>

              {isStreaming && (
                <span className="bg-foreground/70 ml-1 inline-block h-3 w-1 animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
