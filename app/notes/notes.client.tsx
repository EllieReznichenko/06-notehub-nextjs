"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/search-box/SearchBox";
import { Pagination } from "@/components/pagination/Pagination";
import NoteList from "@/components/note-list/NoteList";
import Modal from "@/components/modal/Modal";
import NoteForm from "@/components/note-form/NoteForm";
import Loader from "@/components/loader/Loader";
import ErrorMessage from "@/components/error-message/ErrorMessage";
import css from "./notes.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
}

export default function NotesClient({
  initialPage,
  initialSearch,
}: NotesClientProps) {
  console.log("NotesClient rendered");
  const [page, setPage] = useState(initialPage);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => {
      console.log("useQuery -> fetchNotes called");
      return fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      });
    },
    placeholderData: keepPreviousData,
  });

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            total_pages={data.totalPages}
            onPageChange={(selected) => {
              const nextPage = selected + 1;

              if (nextPage < 1) return;

              setPage(nextPage);
            }}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isSuccess && data.notes.length === 0 && (
        <p className={css.empty}>No notes found. Try a different search.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
}
