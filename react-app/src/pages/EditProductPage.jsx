import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import categories from "../components/CategoriesList";
import productService from "../services/productService";
import '../pages/styles/AuthForm.css';
import '../pages/styles/FormControls.css';

function EditProductPage() {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [category, setCategory] = useState('');
    const [pimage, setPimage] = useState(null);
    const [pimage2, setPimage2] = useState(null);

    useEffect(() => {
        productService.getProductById(productId)
            .then((res) => {
                const product = res.data.product;
                if (product) {
                    setPname(product.pname);
                    setPdesc(product.pdesc);
                    setCategory(product.category);
                }
            })
            .catch((err) => alert(err.response?.data?.message || 'Erro ao buscar dados do produto.'));
    }, [productId]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pname', pname);
        formData.append('pdesc', pdesc);
        formData.append('category', category);
        if (pimage) formData.append('pimage', pimage);
        if (pimage2) formData.append('pimage2', pimage2);

        productService.updateProduct(productId, formData)
            .then((res) => {
                alert(res.data.message);
                navigate('/my-products');
            })
            .catch((err) => alert(err.response?.data?.message || 'Erro no servidor ao atualizar produto.'));
    };

    return (
        <div>
            <Header />
            <div className="auth-container" style={{ minHeight: 'auto', background: 'transparent' }}>
                <div className="auth-wrap" style={{width: '700px'}}>
                    <form className="auth-form" onSubmit={handleUpdate}>
                        <span className="auth-form-title">Editar Produto</span>

                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Nome do Produto" type="text" value={pname || ''} onChange={(e) => setPname(e.target.value)} required />
                        </div>
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Descrição do Produto" type="text" value={pdesc || ''} onChange={(e) => setPdesc(e.target.value)} required />
                        </div>
                        <div className="form-input-wrap">
                             <select className="form-select" value={category || ''} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="">Selecione a Categoria</option>
                                {categories.map((item, index) => (<option key={index} value={item}>{item}</option>))}
                            </select>
                        </div>
                        <div className="form-input-wrap">
                            <label style={{display: 'block', width: '100%', color: '#999999', padding: '0 0 10px 15px'}}>Nova Imagem Principal (Opcional)</label>
                            <input className="form-input" type="file" onChange={(e) => setPimage(e.target.files[0])} />
                        </div>
                        <div className="form-input-wrap">
                             <label style={{display: 'block', width: '100%', color: '#999999', padding: '0 0 10px 15px'}}>Nova Imagem Secundária (Opcional)</label>
                            <input className="form-input" type="file" onChange={(e) => setPimage2(e.target.files[0])} />
                        </div>
                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="submit" className="form-btn">Atualizar Produto</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProductPage;