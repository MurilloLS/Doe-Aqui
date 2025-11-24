import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; 
import Header from "../components/Header";
import productService from "../services/productService";
import userService from "../services/userService";
import './styles/ProductDetailPage.css'; 
import toast from "react-hot-toast";

function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [showContact, setShowContact] = useState(false);

    // Configurações do Carrossel para as imagens extra
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
        ]
    };

    useEffect(() => {
        productService.getProductById(productId)
            .then((res) => {
                if (res.data.product) {
                    setProduct(res.data.product);
                }
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Erro no servidor.'));
    }, [productId]);

    const handleShowContact = () => {
        if (!product?.addedBy) return;
        setShowContact(prev => !prev);
        if (!showContact && !user) {
            userService.getUserDetails(product.addedBy)
                .then((res) => {
                    if (res.data.user) setUser(res.data.user);
                })
                .catch((err) => toast.error(err.response?.data?.message || 'Erro no servidor.'));
        }
    };

    if (!product) {
        return (
            <>
                <Header />
                <p style={{textAlign: 'center', marginTop: '30px'}}>Carregando item...</p>
            </>
        );
    }

    // Separa as imagens: a primeira é a principal, o resto vai para o carrossel
    const remainingImages = [product.pimage2].filter(Boolean);

    return (
        <div>
            <Header />
            {/* Secção Superior: Imagem Principal + Detalhes */}
            <section className="product-detail-top-section">
                <div className="product-main-image-container">
                    <img 
                        src={product.pimage} 
                        alt={product.pname} 
                        className="product-main-image" 
                    />
                </div>
                <div className="product-info-box">
                    <h2 className="product-title">{product.pname}</h2>
                    <div className="donation-status">Item para Doação</div>
                    <div className="product-description"><p>{product.pdesc}</p></div>
                    <button className="contact-button" onClick={handleShowContact}>
                        {showContact ? "Ocultar Contato" : "Tenho Interesse"}
                    </button>
                    {showContact && user && (
                        <div className="contact-card">
                            <h5>Informações do Doador</h5>
                            <p><strong>Nome:</strong> {user.username}</p>
                            {user.mobile && <p><strong>Telefone:</strong> {user.mobile}</p>}
                            {user.email && <p><strong>Email:</strong> {user.email}</p>}
                        </div>
                    )}
                </div>
            </section>

            {/* Secção Inferior: Carrossel de Imagens Adicionais */}
            {remainingImages.length > 0 && (
                <section className="carousel-section-detail">
                    <h3 className="carousel-title-detail">Mais Imagens</h3>
                    <Slider {...sliderSettings}>
                        {remainingImages.map((image, index) => (
                            <div key={index} className="carousel-image-item">
                                <img 
                                    src={image} 
                                    alt={`${product.pname} - imagem ${index + 2}`} 
                                    className="carousel-image"
                                />
                            </div>
                        ))}
                    </Slider>
                </section>
            )}
        </div>
    );
}

export default ProductDetailPage;