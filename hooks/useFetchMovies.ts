import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Character, Characters } from "@/interface/Characters.interface";

export default function useFetchMovies() {
  const [data, setData] = useState<Character[] | null>(null);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((result) => setData(result.results));
  }, []);

  return {
    data,
  };
}
