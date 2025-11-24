import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import './../components/Home.css';
import toast from "react-hot-toast";

function CategoryPage() {
    const { catName } = useParams();
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        productService.getProducts(catName)
            .then((res) => {
                setProducts(res.data.products);
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Erro no servidor.'));
    }, [catName]);
    
    return (
        <div>
            <Header />
            <Categories />
            <h5 style={{ marginTop: '15px', paddingLeft: '20px' }}> Mostrando produtos da categoria: {catName} </h5>
            <div className="d-flex justify-content-center flex-wrap">
                {products.length > 0 ? (
                    products.map((item) => (
                        <ProductCard key={item._id} product={item} />
                    ))
                ) : (
                    <p>Nenhum produto encontrado nesta categoria.</p>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;