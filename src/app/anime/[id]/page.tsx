"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import { fetchZoro } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Plus, Check, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { AnimeCard } from "@/components/anime/AnimeCard";
import type { Anime, Episode } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Katana } from "@/components/shared/Icons";
import { Clock, CheckCircle, XCircle } from "lucide-react";

async function getAnimeData(id: string) {
  const animeRes = await fetchZoro(`info`, { id });
  const recommendationsRes = await fetchZoro("most-popular");

  return {
    anime: animeRes,
    recommendedAnime: recommendationsRes.results.slice(0, 5),
  };
}

const listTypes = [
  { value: "watching", label: "Watching", icon: Katana },
  { value: "watch_later", label: "Watch Later", icon: Bookmark },
  { value: "completed", label: "Completed", icon: CheckCircle },
  { value: "on_hold", label: "On Hold", icon: Clock },
  { value: "dropped", label: "Dropped", icon: XCircle },
];

type ParamsPromise = Promise<{ id: string }>;

interface AnimeDetailPageProps {
  params: ParamsPromise;
}

export default function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  // Unwrap params promise using React.use()
  const { id } = use(params);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState<string | false>(false);
  const [listLoading, setListLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 20;

  const checkUserList = useCallback(async () => {
    if (!user) {
      setListLoading(false);
      return;
    }
    setListLoading(true);
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let foundInList = false;
      for (const listType of listTypes) {
        if (userData[listType.value] && userData[listType.value].includes(id)) {
          setIsInList(listType.value);
          foundInList = true;
          break;
        }
      }
      if (!foundInList) setIsInList(false);
    } else {
      setIsInList(false);
    }
    setListLoading(false);
  }, [user, id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAnimeData(id);
      if (!data.anime || !data.anime.id) {
        notFound();
      }
      setAnime(data.anime);
      setRecommendedAnime(data.recommendedAnime);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    checkUserList();
  }, [checkUserList]);

  const handleListAction = async (list: string) => {
    if (!user || !anime) {
      toast({
        variant: "destructive",
        title: "You must be logged in to add to a list.",
      });
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      const updateData: { [key: string]: any } = {};

      if (isInList && isInList !== list) {
        // remove from old list
        const oldListData = { [isInList]: arrayRemove(anime.id) };
        await updateDoc(userDocRef, oldListData);
      }

      if (isInList === list) {
        // remove from list
        updateData[list] = arrayRemove(anime.id);
        await updateDoc(userDocRef, updateData);
        setIsInList(false);
        toast({ title: `Removed from ${list}` });
      } else {
        // add to list
        updateData[list] = arrayUnion(anime.id);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, updateData);
        } else {
          await setDoc(userDocRef, updateData);
        }
        setIsInList(list);
        toast({ title: `Added to ${list}` });
      }
    } catch (error) {
      console.error("Error updating list: ", error);
      toast({
        variant: "destructive",
        title: "Failed to update list.",
      });
    }
  };

  if (loading || !anime) {
    return <div>Loading...</div>;
  }

  const episodes: Episode[] = anime.episodes || [];
  
  // Pagination logic
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = episodes.slice(indexOfFirstEpisode, indexOfLastEpisode);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <Image
            src={anime.image}
            alt={anime.title}
            width={400}
            height={600}
            className="rounded-lg shadow-2xl w-full"
            data-ai-hint="anime poster"
          />
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <Badge variant="secondary" className="mb-2">
            {anime.type}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-2">{anime.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <span>{anime.status}</span>
            <span>•</span>
            <span>{anime.totalEpisodes || "?"} Episodes</span>
          </div>
          <p className="text-muted-foreground mb-6">{anime.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" disabled={episodes.length === 0}>
              <Link href={episodes.length > 0 ? `/watch/${anime.id}/${episodes[0].id}` : "#"}>
                <Play className="mr-2 h-5 w-5" />
                Watch Episode 1
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="lg" disabled={listLoading}>
                  {isInList ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                  {isInList ? `In ${isInList}` : "Add to List"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {listTypes.map((listType) => (
                  <DropdownMenuItem key={listType.value} onClick={() => handleListAction(listType.value)}>
                    <listType.icon className="mr-2 h-4 w-4" />
                    {listType.label}
                  </DropdownMenuItem>
                ))}
                {isInList && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onClick={() => handleListAction(isInList as string)}>
                      Remove from List
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {episodes && episodes.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-headline font-bold">Episodes</h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentEpisodes.map((ep) => (
              <Link key={ep.id} href={`/watch/${anime.id}/${ep.id}`}>
                <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={ep.image || anime.image}
                        alt={ep.title || `Episode ${ep.number}`}
                        fill
                        className="object-cover"
                        data-ai-hint="anime episode thumbnail"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold truncate">
                        E{ep.number}: {ep.title || `Episode ${ep.number}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {recommendedAnime && recommendedAnime.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-headline font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedAnime.map((rec) => (
              <AnimeCard key={rec.id} anime={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
