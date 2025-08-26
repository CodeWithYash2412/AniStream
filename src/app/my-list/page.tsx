"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { fetchZoro } from "@/lib/utils";
import type { Anime } from "@/lib/types";
import { Eye, CheckCircle, Clock, XCircle, Star } from 'lucide-react';
import { Katana } from '@/components/shared/Icons';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyListPage() {
  const [lists, setLists] = useState([
    { value: "watching", label: "Watching", icon: <Katana className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "completed", label: "Completed", icon: <CheckCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "on_hold", label: "On Hold", icon: <Clock className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "dropped", label: "Dropped", icon: <XCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  ]);

  useEffect(() => {
    const fetchLists = async () => {
      // In a real app, this would fetch user-specific lists.
      // For this demo, we'll fetch data for each category.
      const listPromises = [
        fetchZoro('top-airing'),
        fetchZoro('latest-completed'),
        fetchZoro('most-favorite'),
        fetchZoro('most-popular')
      ];
      
      const [watchingRes, completedRes, onHoldRes, droppedRes] = await Promise.all(listPromises);

      setLists([
        { value: "watching", label: "Watching", icon: <Katana className="w-4 h-4" />, data: watchingRes.results.slice(0,6), isLoading: false },
        { value: "completed", label: "Completed", icon: <CheckCircle className="w-4 h-4" />, data: completedRes.results.slice(0,12), isLoading: false },
        { value: "on_hold", label: "On Hold", icon: <Clock className="w-4 h-4" />, data: onHoldRes.results.slice(0,4), isLoading: false },
        { value: "dropped", label: "Dropped", icon: <XCircle className="w-4 h-4" />, data: droppedRes.results.slice(0,2), isLoading: false },
      ]);
    }
    fetchLists();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-8">
      {Array.from({length: 6}).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[275px] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );

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
              {list.isLoading ? renderSkeleton() : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-8">
                {list.data.length > 0 ? (
                    list.data.map(anime => <AnimeCard key={anime.id} anime={anime} />)
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-16">
                    <p>No anime in this list yet.</p>
                    </div>
                )}
                </div>
              )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
