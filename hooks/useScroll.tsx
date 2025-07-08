import { useEffect, useRef, useState } from 'react';

export function useScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const checkScroll = () => { setHasScroll(el.scrollHeight - el.clientHeight > 1); };

    checkScroll();
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    const mutationObserver = new MutationObserver(checkScroll);
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return { ref, hasScroll };
}
