"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;

  if (isError || !note) return <ErrorMessage />;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>{note.title}</h1>
        <p className={css.content}>{note.content}</p>
        <p className={css.tag}>{note.tag}</p>
      </div>
    </main>
  );
}
