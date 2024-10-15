import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { data: sessionData } = useSession();
  const [favorites, setFavorites] = useState([]);

  const {
    data: favoritesData,
    isLoading: isLoadingFavorites,
    errorFavorites,
  } = useSWR(
    sessionData?.user
      ? `/api/favorites?userId=${sessionData.user.userId}`
      : null
  );

  useEffect(() => {
    if (favoritesData?.imageIds) {
      setFavorites(favoritesData.imageIds);
    }
  }, [favoritesData]);

  if (isLoadingFavorites) {
    null;
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoadingFavorites, setFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
