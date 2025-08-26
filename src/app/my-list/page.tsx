"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { mockAnime } from "@/lib/mock-data";
import { Eye, CheckCircle, Clock, XCircle, Star } from 'lucide-react';
import { Katana } from '@/components/shared/Icons';

export default function MyListPage() {
  const [watching] = useState([...mockAnime].slice(0, 4));
  const [completed] = useState([...mockAnime].slice(4, 9));
  const [watchLater] = useState([...mockAnime].slice(9, 14));
  const [dropped] = useState([...mockAnime].slice(14, 16));

  const lists = [
    { value: "watching", label: "Watching", icon: <Katana className="w-4 h-4" />, data: watching },
    { value: "completed", label: "Completed", icon: <CheckCircle className="w-4 h-4" />, data: completed },
    { value: "watch-later", label: "Watch Later", icon: <Clock className="w-4 h-4" />, data: watchLater },
    { value: "dropped", label: "Dropped", icon: <XCircle className="w-4 h-4" />, data: dropped },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">My Anime List</h1>
      <Tabs defaultValue="watching" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          {lists.map(list => (
            <TabsTrigger key={list.value} value={list.value} className="py-2 gap-2">
              {list.icon}
              {list.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {lists.map(list => (
            <TabsContent key={list.value} value={list.value}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-8">
                {list.data.length > 0 ? (
                    list.data.map(anime => <AnimeCard key={anime.id} anime={anime} />)
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-16">
                    <p>No anime in this list yet.</p>
                    </div>
                )}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
