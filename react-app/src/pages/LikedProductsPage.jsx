import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useLikedProducts } from "../contexts/LikedProductsContext";
import userService from "../services/userService";
import '../pages/styles/Carousel.css'; 
import toast from "react-hot-toast";

function LikedProductsPage() {
    const [products, setProducts] = useState([]);
    const { likedProductIds } = useLikedProducts();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            userService.getLikedProducts()
                .then((res) => {
                    setProducts(res.data.products || []);
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message || 'Erro no servidor.');
                    setProducts([]);
                });
        }
    }, [likedProductIds]);

    return (
        <div>
            <Header />
            <main className="showcase-container">
                <h2 className="carousel-title" style={{ textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    Meus <strong>Favoritos</strong>
                </h2>

                {products.length > 0 ? (
                    <div className="product-grid" style={{ paddingTop: '20px' }}>
                        {products.map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                ) : (
                    <p>Você ainda não curtiu nenhum item.</p>
                )}
            </main>
        </div>
    );
}

export default LikedProductsPage;