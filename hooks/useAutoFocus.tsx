import { useEffect, useRef } from 'react';

export function useAutoFocus<T extends HTMLElement>(deps: any[] = []) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            ref.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
    }, deps);

    return ref;
}
