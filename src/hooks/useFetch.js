// Custom Hook: useFetch (Lectures 31-36, 67-72)
import { useState, useEffect, useCallback } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (fetchUrl) => {
    const targetUrl = fetchUrl || url;
    if (!targetUrl) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(targetUrl, options);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url && !options.manual) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};
