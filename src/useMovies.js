import { useState, useEffect } from "react";

const KEY = "565cb85c";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErorr] = useState("");

  useEffect(
    function () {
      // callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErorr("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}
          `,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False")
            throw new Error("Movie not Found ,Search another movie");

          setMovies(data.Search);
          setErorr("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setErorr(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setErorr("");
        return;
      }
      // handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
