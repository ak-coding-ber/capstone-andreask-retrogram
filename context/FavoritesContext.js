import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData?.user) {
      // setIsLoadingFavorites(true);
      getFavoritesData(sessionData.user.userId); // Fetch favorites when sessionData is authenticated
    }
  }, [sessionData]);

  async function getFavoritesData(userId) {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();

      if (data[0].imageIds && data[0].imageIds.length > 0) {
        console.log("Fetched favorites:", data[0].imageIds);
        setFavorites(data[0].imageIds);
        // setIsLoadingFavorites(false);
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
