
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/anime/AnimeCard";
import type { Anime } from "@/lib/types";
import { Katana } from '@/components/shared/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, XCircle, Loader2, Bookmark } from 'lucide-react';
import { fetchZoro } from '@/lib/utils';

const initialLists = [
  { value: "watching", label: "Watching", icon: <Katana className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  { value: "watch_later", label: "Watch Later", icon: <Bookmark className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  { value: "completed", label: "Completed", icon: <CheckCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  { value: "on_hold", label: "On Hold", icon: <Clock className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  { value: "dropped", label: "Dropped", icon: <XCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
];

export default function MyListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState(initialLists);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchAnimeDetails = async (animeIds: string[]) => {
        const animePromises = animeIds.map(id => fetchZoro('info', { id }));
        const animeResults = await Promise.all(animePromises);
        return animeResults.filter(a => a && a.id);
    }
    
    const unsub = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
        const userData = docSnap.exists() ? docSnap.data() : {};
        
        setLists(prevLists => {
          const newLists = [...prevLists];
          let listsChanged = false;

          const updatePromises = newLists.map(async (list, index) => {
            const animeIds = userData[list.value] || [];
            let currentData = newLists[index].data;
            let currentLoading = newLists[index].isLoading;
            
            if (animeIds.length > 0) {
              const animeData = await fetchAnimeDetails(animeIds);
              if (JSON.stringify(currentData) !== JSON.stringify(animeData)) {
                currentData = animeData;
                listsChanged = true;
              }
            } else if (currentData.length > 0) {
              currentData = [];
              listsChanged = true;
            }
            
            if (currentLoading) {
              currentLoading = false;
              listsChanged = true;
            }

            newLists[index] = { ...list, data: currentData, isLoading: currentLoading };
          });
          
          Promise.all(updatePromises).then(() => {
              if (listsChanged) {
                  setLists([...newLists]);
              }
          });
          
          return prevLists; // Return previous state while async operations run
        });
    });

    return () => unsub();
  }, [user]);

  if (authLoading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    );
  }

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
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
