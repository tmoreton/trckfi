import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  // getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key)
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
}

export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
};

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear()
  }
};

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}