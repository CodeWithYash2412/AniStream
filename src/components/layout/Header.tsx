"use client";

import Link from "next/link";
import { Search, Clapperboard, Tv, Film, Star, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import type { Anime } from "@/lib/types";
import Image from "next/image";
import { fetchJikan } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/tv", label: "TV Shows" },
  { href: "/category/movie", label: "Movies" },
  { href: "/genres", label: "Genres" },
  { href: "/my-list", label: "My List" },
  { href: "/recommendations", label: "For You" },
];

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearchQuery) {
        setIsLoading(true);
        const res = await fetchJikan('anime', { q: debouncedSearchQuery, limit: '5' });
        setSearchResults(res.data || []);
        setIsPopoverOpen(true);
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setIsPopoverOpen(false);
      }
    };
    fetchSearch();
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsPopoverOpen(false);
      searchInputRef.current?.blur();
    }
  };
  
  const handleSuggestionClick = () => {
    setSearchQuery("");
    setIsPopoverOpen(false);
    searchInputRef.current?.blur();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">AniStream</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search anime..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {if (searchResults.length > 0) setIsPopoverOpen(true)}}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
              </form>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
              {searchResults.length > 0 ? (
                <>
                  <div className="py-2 text-sm text-muted-foreground text-center">Top Results</div>
                  <ul className="space-y-1 p-1">
                    {searchResults.map((anime) => (
                      <li key={anime.mal_id}>
                        <Link href={`/anime/${anime.mal_id}`} onClick={handleSuggestionClick} className="block">
                          <Button
                            variant="ghost"
                            className="w-full h-auto justify-start p-2"
                          >
                            <Image
                              src={anime.images.jpg.image_url}
                              alt={anime.title}
                              width={40}
                              height={60}
                              data-ai-hint="anime poster"
                              className="rounded-sm mr-3 object-cover w-10 h-14"
                            />
                            <span className="text-left whitespace-normal">{anime.title}</span>
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="p-1 border-t border-border">
                    <Button variant="ghost" className="w-full justify-center" onClick={handleSearchSubmit}>
                      View all results for &quot;{searchQuery}&quot;
                    </Button>
                  </div>
                </>
              ) : !isLoading && debouncedSearchQuery && (
                 <div className="py-4 text-sm text-muted-foreground text-center">
                  No results found.
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
