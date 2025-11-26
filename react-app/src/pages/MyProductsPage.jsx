import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import '../pages/styles/Carousel.css';
import toast from "react-hot-toast";

function MyProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const fetchMyProducts = () => {
        productService.getMyProducts()
            .then((res) => {
                setProducts(res.data.products);
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Erro no servidor.'));
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleDelete = (productId) => {
        if (window.confirm("Tem certeza que quer apagar este produto?")) {
            productService.deleteProduct(productId)
                .then((res) => {
                    toast.success(res.data.message);
                    fetchMyProducts(); 
                })
                .catch((err) => toast.error(err.response?.data?.message || 'Erro no servidor.'));
        }
    };

    return (
        <div>
            <Header />
            <main className="showcase-container">
                <h2 className="carousel-title" style={{ textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    Meus <strong>Itens para Doação</strong>
                </h2>

                {products.length > 0 ? (
                    <div className="product-grid" style={{ paddingTop: '20px' }}>
                        {products.map((item) => (
                            <div key={item._id}>
                                <ProductCard product={item} />
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <button 
                                        className="carousel-card-button" 
                                        style={{ backgroundColor: '#17a2b8', flex: 1 }}
                                        onClick={() => navigate(`/edit-product/${item._id}`)}>
                                        Editar
                                    </button>
                                    <button 
                                        className="carousel-card-button" 
                                        style={{ backgroundColor: '#dc3545', flex: 1 }}
                                        onClick={() => handleDelete(item._id)}>
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Você ainda não adicionou nenhum item.</p>
                )}
            </main>
        </div>
    );
}

export default MyProductsPage;