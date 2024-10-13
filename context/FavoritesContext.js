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
  }, [sessionData?.user, hasFetched]);

  async function getFavoritesData(userId) {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();

      console.log("data inside Favorites context", data);

      if (data && data.imageIds && data.imageIds.length > 0) {
        setFavorites(data.imageIds);
        setHasFetched(true);
      } else {
        // If no favorites, set to empty array
        setFavorites([]);
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
