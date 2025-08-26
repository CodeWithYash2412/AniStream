
"use client";

import Link from "next/link";
import { Search, Clapperboard, Tv, Film, Star, Sparkles, Loader2, LogOut, UserCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResult } from "@/lib/types";
import Image from "next/image";
import { fetchZoro } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/tv", label: "TV Shows" },
  { href: "/category/movie", label: "Movies" },
  { href: "/genres", label: "Genres" },
];

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearchQuery) {
        setIsLoading(true);
        const res = await fetchZoro(debouncedSearchQuery);
        setSearchResults(res.results?.slice(0, 5) || []);
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
      setIsSheetOpen(false);
      searchInputRef.current?.blur();
    }
  };
  
  const handleSuggestionClick = () => {
    setSearchQuery("");
    setIsPopoverOpen(false);
    setIsSheetOpen(false);
    searchInputRef.current?.blur();
  }
  
  const handleNavLinkClick = () => {
    setIsSheetOpen(false);
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    setIsSheetOpen(false);
  };

  const renderNavLinks = (isMobile = false) => (
      <nav className={isMobile ? "flex flex-col gap-4 text-lg mt-6" : "hidden md:flex items-center gap-6"}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavLinkClick}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
         {user && (
          <Link href="/my-list" onClick={handleNavLinkClick} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            My List
          </Link>
        )}
         <Link href="/recommendations" onClick={handleNavLinkClick} className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
             <Sparkles className="mr-2 h-4 w-4 text-accent" />
            For You
          </Link>
      </nav>
  );

  const renderSearch = () => (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs">
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
                <li key={anime.id}>
                  <Link href={`/anime/${anime.id}`} onClick={handleSuggestionClick} className="block">
                    <Button
                      variant="ghost"
                      className="w-full h-auto justify-start p-2"
                    >
                      <Image
                        src={anime.image}
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
  );

  const renderAuthButtons = () => (
    user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                 <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                <AvatarFallback>
                    <UserCircle />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                    {user.displayName || 'Welcome'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      )
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile View */}
        <div className="md:hidden flex-1">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                   <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                 <SheetContent side="left" className="w-full sm:w-80 p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>
                            <Link href="/" onClick={handleNavLinkClick} className="flex items-center space-x-2">
                                <Clapperboard className="h-6 w-6 text-primary" />
                                <span className="inline-block font-bold font-headline text-lg">AniStream</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="p-4">
                        <div className="mb-6">{renderSearch()}</div>
                        {renderNavLinks(true)}
                         <div className="mt-8 border-t pt-6">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                         <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                                            <AvatarFallback>
                                                <UserCircle className="w-6 h-6"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {user.displayName || 'Welcome'}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" onClick={handleLogout} className="justify-start">
                                      <LogOut className="mr-2 h-4 w-4" />
                                      <span>Log out</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Button asChild className="w-full"><Link href="/login" onClick={handleNavLinkClick}>Login</Link></Button>
                                    <Button asChild variant="outline" className="w-full"><Link href="/signup" onClick={handleNavLinkClick}>Sign Up</Link></Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        <div className="md:hidden flex-1 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
                <Clapperboard className="h-6 w-6 text-primary" />
                <span className="inline-block font-bold font-headline text-lg">AniStream</span>
            </Link>
        </div>
         <div className="md:hidden flex-1" />


        {/* Desktop View */}
        <div className="hidden md:flex w-full items-center justify-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
                <Clapperboard className="h-6 w-6 text-primary" />
                <span className="inline-block font-bold font-headline text-lg">AniStream</span>
            </Link>

            <div className="w-px h-6 bg-border mx-4" />
            
            {renderNavLinks()}

            <div className="w-px h-6 bg-border mx-4" />

            {renderSearch()}
            {renderAuthButtons()}
        </div>
      </div>
    </header>
  );
}
