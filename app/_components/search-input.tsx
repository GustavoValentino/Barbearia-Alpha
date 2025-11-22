"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/barbershops?search=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center">
      <Input
        type="text"
        placeholder="Buscar barbearias ou serviços..."
        className="border-secondary bg-card focus-visible:ring-primary h-12 w-full rounded-xl pr-14 pl-5 text-base shadow-sm focus-visible:ring-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button
        type="submit"
        size="icon"
        className="hover:bg-primary/90 absolute top-1.5 right-1.5 h-9 w-9 rounded-lg transition-all"
      >
        <SearchIcon size={18} />
      </Button>
    </form>
  );
};

export default SearchInput;
