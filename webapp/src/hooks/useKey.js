import { useState, useEffect } from 'react';

export default function useKey(key, callback) {
  const [pressed, setPressed] = useState(false)
  const match = event => key.toLowerCase() === event.key.toLowerCase()

  const onUp = event => {
    if (match(event)) {
      callback()
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", onUp)
    return () => {
      window.removeEventListener("keyup", onUp)
    }
  }, [key])

  return pressed
}