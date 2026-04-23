import axios from "axios";
import type {
  FetchNotesParams,
  FetchNotesResponse,
  NewNoteData,
  Note,
} from "@/types/note";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pc3NmbGFzaDk2QGdtYWlsLmNvbSIsImlhdCI6MTc3NjYxOTg5MH0.f4_s5dFIRoos2VHwAoz31BH4exsiJvROB6TpxtfQwcQ";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  console.log("fetchNotes() entered", { page, perPage, search });

  const params: FetchNotesParams = { page, perPage };

  if (search?.trim()) {
    params.search = search;
  }

  try {
    const { data } = await api.get<RawFetchNotesResponse>("/notes", {
      params,
    });

    console.log("fetchNotes success", data);

    return {
      notes: data.notes,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.log("fetchNotes error", error);
    throw error;
  }
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
