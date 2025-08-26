"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/anime/AnimeCard";
import type { Anime } from "@/lib/types";
import { Katana } from '@/components/shared/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchZoro } from '@/lib/utils';

export default function MyListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState([
    { value: "watching", label: "Watching", icon: <Katana className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "completed", label: "Completed", icon: <CheckCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "on_hold", label: "On Hold", icon: <Clock className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
    { value: "dropped", label: "Dropped", icon: <XCircle className="w-4 h-4" />, data: [] as Anime[], isLoading: true },
  ]);

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
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const newListData = [...lists];
            
            for(const list of newListData) {
                const animeIds = userData[list.value] || [];
                if(animeIds.length > 0) {
                    const animeData = await fetchAnimeDetails(animeIds);
                    const listIndex = newListData.findIndex(l => l.value === list.value);
                    if(listIndex !== -1) {
                       newListData[listIndex].data = animeData;
                    }
                } else {
                    const listIndex = newListData.findIndex(l => l.value === list.value);
                     if(listIndex !== -1) {
                       newListData[listIndex].data = [];
                    }
                }
                const listIndex = newListData.findIndex(l => l.value === list.value);
                if(listIndex !== -1) newListData[listIndex].isLoading = false;
            }
            setLists(newListData);
        } else {
             const newListData = [...lists];
             for(const list of newListData) {
                const listIndex = newListData.findIndex(l => l.value === list.value);
                if(listIndex !== -1) {
                    newListData[listIndex].data = [];
                    newListData[listIndex].isLoading = false;
                }
             }
             setLists(newListData);
        }
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
