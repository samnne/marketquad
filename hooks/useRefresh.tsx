import { useCallback, useState } from "react";

export function useRefresh({ func }: { func: Function }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await func();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [func]);

  return { refreshing, onRefresh };
}
