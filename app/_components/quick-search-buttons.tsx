import {
  EyeIcon,
  FootprintsIcon,
  ScissorsIcon,
  SparklesIcon,
  UserIcon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PageSectionScroller } from "./ui/page";

const searchOptions = [
  { label: "Cabelo", value: "cabelo", icon: ScissorsIcon },
  { label: "Barba", value: "barba", icon: UserIcon },
  { label: "Acabamento", value: "acabamento", icon: SparklesIcon },
  { label: "Sobrancelha", value: "sobrancelha", icon: EyeIcon },
  { label: "Pézinho", value: "pézinho", icon: FootprintsIcon },
  { label: "Progressiva", value: "progressiva", icon: WavesIcon },
];

const QuickSearchButtons = () => {
  return (
    <PageSectionScroller className="flex gap-3 py-2">
      {searchOptions.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          className="border-secondary bg-card text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary h-auto gap-2 rounded-full px-6 py-2.5 font-medium transition-all"
          asChild
        >
          <Link href={`/barbershops?search=${option.value}`}>
            <option.icon className="size-4" />
            {option.label}
          </Link>
        </Button>
      ))}
    </PageSectionScroller>
  );
};

export default QuickSearchButtons;
