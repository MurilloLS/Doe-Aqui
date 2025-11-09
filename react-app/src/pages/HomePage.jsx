import { useEffect, useState } from "react";
import Header from "../components/Header";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import '../pages/styles/Carousel.css';
import '../components/Home.css'; 

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [search, setSearch] = useState(''); 

    useEffect(() => {
        productService.getProducts()
            .then((res) => setProducts(res.data.products))
            .catch((err) => console.error('Erro ao buscar produtos:', err));
    }, []);

    const handleCategoryFilter = (category) => {
        if (!category) {
            clearFilter();
            return;
        }
        productService.getProducts(category)
            .then((res) => {
                setFilteredProducts(res.data.products);
                setIsFiltered(true);
            })
            .catch((err) => console.error('Erro ao filtrar por categoria:', err));
    };

    const clearFilter = () => {
        setIsFiltered(false);
        setFilteredProducts([]);
        setSearch(''); 
    };

    const handleSearch = () => {
        // Assume-se que a localização do usuário pode ser armazenada no localStorage
        const userLocation = localStorage.getItem('userLoc') || ''; 
        productService.searchProducts(search, userLocation)
            .then((res) => {
                setFilteredProducts(res.data.products);
                setIsFiltered(true);
            })
            .catch((err) => console.error('Erro ao buscar produtos:', err));
    };


    const productsToDisplay = isFiltered ? filteredProducts : products;

    return (
        <div>
            <Header 
                search={search}
                handlesearch={setSearch}
                handleClick={handleSearch}
            />
            <Categories handleCategory={handleCategoryFilter} />
            
            <main className="showcase-container">
                 <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <h2 className="carousel-title" style={{ textAlign: 'left', borderBottom: 'none', flexGrow: 1, margin: 0, paddingBottom: '10px' }}>
                        {isFiltered ? <strong>Resultados da Busca</strong> : <span>Todos os <strong>Itens</strong></span>}
                    </h2>
                    {isFiltered && (
                        <button className="clear-filter-btn" onClick={clearFilter}>
                            LIMPAR
                        </button>
                    )}
                </div>
                
                {productsToDisplay.length > 0 ? (
                    <div className="product-grid" style={{ paddingTop: '20px' }}>
                        {productsToDisplay.map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                ) : (
                     <p style={{marginTop: '20px'}}>Nenhum item encontrado.</p>
                )}
            </main>
        </div>
    );
}

export default HomePage;