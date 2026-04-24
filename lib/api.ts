import axios from "axios";
import type { Note, NewNoteData } from "@/types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

console.log("TOKEN:", process.env.NEXT_PUBLIC_NOTEHUB_TOKEN);

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("AUTH:", `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`);

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: FetchNotesParams = { page, perPage };

  if (search?.trim()) {
    params.search = search;
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: NewNoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
