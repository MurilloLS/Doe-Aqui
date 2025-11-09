import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import userService from '../services/userService';

const LikedProductsContext = createContext();

export const LikedProductsProvider = ({ children }) => {
    const [likedProductIds, setLikedProductIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token'); 

    const fetchLikedProducts = useCallback(() => {
        setIsLoading(true);
        if (token) {
            userService.getLikedProductIds()
                .then(res => {
                    if (Array.isArray(res.data.ids)) {
                        setLikedProductIds(new Set(res.data.ids));
                    }
                })
                .catch(err => console.error("Falha ao buscar produtos curtidos", err))
                .finally(() => setIsLoading(false));
        } else {
            setLikedProductIds(new Set());
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchLikedProducts();
    }, [fetchLikedProducts]);

    const likeProduct = (productId) => {
        if (!token) {
            alert('Por favor, faça login para curtir produtos.');
            return;
        }

        userService.likeProduct(productId)
            .then(() => {
                setLikedProductIds(prevIds => new Set(prevIds).add(productId));
            })
            .catch(err => console.error("Falha ao curtir produto", err));
    };

    const unlikeProduct = (productId) => {
        if (!token) return;
        userService.unlikeProduct(productId)
            .then(() => {
                setLikedProductIds(prevIds => {
                    const newIds = new Set(prevIds);
                    newIds.delete(productId);
                    return newIds;
                });
            })
            .catch(err => console.error("Falha ao descurtir produto", err));
    };

    const value = { likedProductIds, likeProduct, unlikeProduct, isLoading };

    return (
        <LikedProductsContext.Provider value={value}>
            {children}
        </LikedProductsContext.Provider>
    );
};

export const useLikedProducts = () => {
    return useContext(LikedProductsContext);
};