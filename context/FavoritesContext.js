import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { data: sessionData } = useSession();
  const [hasFetched, setHasFetched] = useState(false);

  const { data: favoritesData, isLoading: isLoadingFavorites } = useSWR(
    sessionData?.user
      ? `/api/favorites?userId=${sessionData.user.userId}`
      : null
  );

  useEffect(() => {
    if (sessionData?.user && !hasFetched) {
      getFavoritesData(sessionData.user.userId); // Fetch favorites when user is authenticated
    }
  });

  async function getFavoritesData(userId) {
    try {
      // const response = await fetch(`/api/favorites?userId=${userId}`);
      // const data = await response.json();

      if (
        favoritesData &&
        favoritesData.imageIds &&
        favoritesData.imageIds.length > 0
      ) {
        setFavorites(favoritesData.imageIds);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, setFavorites, isLoadingFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
