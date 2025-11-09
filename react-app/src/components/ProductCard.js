import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLikedProducts } from '../contexts/LikedProductsContext';
import './Home.css';
import '../pages/styles/Carousel.css'; 

function ProductCard({ product }) {
    const navigate = useNavigate();
    const { likedProductIds, likeProduct, unlikeProduct } = useLikedProducts();
    const API_BASE_URL = 'http://localhost:4000';

    const isLiked = likedProductIds.has(product._id);

    const handleToggleLike = (e) => {
        e.stopPropagation(); 
        if (isLiked) {
            unlikeProduct(product._id);
        } else {
            likeProduct(product._id);
        }
    };

    const handleProductClick = () => {
        navigate(`/product/${product._id}`);
    }

    return (
        <div className="carousel-card">
            <div className="carousel-card-image-container">
                {/* O onClick para favoritar continua a funcionar apenas no coração */}
                <div onClick={handleToggleLike} className="icon-con" style={{ opacity: 1 }}>
                    <FaHeart className="icons" style={{ color: isLiked ? 'red' : 'grey' }} />
                </div>
                <img src={`${API_BASE_URL}/${product.pimage}`} alt={product.pname} />
            </div>
            <div className="carousel-card-details">
                <span className="carousel-card-brand">{product.category}</span>
                <br />
                <span className="carousel-card-name">{product.pname}</span>
            </div>
            
            <div className="carousel-card-actions">
                {/* O onClick para navegar funciona apenas neste botão */}
                <button className="carousel-card-button" onClick={handleProductClick}>
                    Ver Item
                </button>
            </div>
        </div>
    );
}

export default ProductCard;