import { useState, useEffect } from 'react';

interface UseImageLoaderReturn {
    imageLoading: boolean;
    imageError: boolean;
    handleImageLoad: () => void;
    handleImageError: () => void;
}

export const useImageLoader = (src ?:  string | null): UseImageLoaderReturn => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Сбрасываем состояния при изменении src
    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [src]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return {
        imageLoading,
        imageError,
        handleImageLoad,
        handleImageError,
    };
};