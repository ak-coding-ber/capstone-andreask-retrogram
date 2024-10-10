import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { data: sessionData } = useSession();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (sessionData?.user && !hasFetched) {
      getFavoritesData(sessionData.user.userId); // Fetch favorites when user is authenticated
    }
  }, [sessionData?.user, hasFetched, favorites.length]);

  async function getFavoritesData(userId) {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();

      if (data[0].imageIds && data[0].imageIds.length > 0) {
        console.log("Fetched favorites:", data[0].imageIds);
        setFavorites(data[0].imageIds);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
