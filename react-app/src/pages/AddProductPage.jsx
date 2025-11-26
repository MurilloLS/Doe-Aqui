import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import categories from "../components/CategoriesList";
import productService from "../services/productService";
import '../pages/styles/AuthForm.css';
import '../pages/styles/FormControls.css';
import toast from "react-hot-toast";

function AddProductPage() {
    const navigate = useNavigate();
    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [category, setCategory] = useState('');
    const [pimage, setPimage] = useState(null);
    const [pimage2, setPimage2] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LÓGICA DE VALIDAÇÃO ADICIONADA ---
    const [errorPname, setErrorPname] = useState('');
    const [errorPdesc, setErrorPdesc] = useState('');

    function testInput(field, text) {
        let regex;
        switch (field) {
            case 'pname':
                // Regex para garantir que o nome tem pelo menos 3 caracteres (não contando apenas espaços)
                regex = /^\s*(\S\s*){3,}\s*$/;
                !regex.test(text) ? setErrorPname('O nome do produto deve ter no mínimo 3 caracteres.') : setErrorPname('');
                break;
            case 'pdesc':
                // Regex para garantir que a descrição tem pelo menos 10 caracteres
                regex = /^\s*(\S\s*){10,}\s*$/;
                !regex.test(text) ? setErrorPdesc('A descrição deve ter no mínimo 10 caracteres.') : setErrorPdesc('');
                break;
            default:
                break;
        }
    }
    // --- FIM DA LÓGICA DE VALIDAÇÃO ---

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocalização não é suportada pelo seu navegador."));
            }
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const handleApi = async (event) => {
        event.preventDefault();

        // Verificação atualizada para incluir os erros de regex
        if (!pname || !pdesc || !category || !pimage || errorPname || errorPdesc) {
            toast.error('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }

        setIsSubmitting(true);

        try {
            const position = await getLocation();
            const { latitude, longitude } = position.coords;

            const formData = new FormData();
            formData.append('plat', latitude);
            formData.append('plong', longitude);
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('category', category);
            formData.append('pimage', pimage);
            if (pimage2) {
                formData.append('pimage2', pimage2);
            }

            const res = await productService.addProduct(formData);
            toast.success(res.data.message);
            navigate('/');

        } catch (err) {
            if (err.code && err.code === 1) {
                toast.error("Você precisa de permitir o acesso à localização para adicionar um produto.");
            } else {
                console.error("Erro ao adicionar produto:", err);
                toast.error(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="auth-container" style={{ minHeight: 'auto', background: 'transparent' }}>
                <div className="auth-wrap" style={{ width: '700px' }}>
                    <form className="auth-form" onSubmit={handleApi}>
                        <span className="auth-form-title">Adicionar Novo Produto</span>

                        {/* Campo Nome do Produto com Validação */}
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Nome do Produto" type="text" value={pname} onChange={(e) => { setPname(e.target.value); testInput('pname', e.target.value); }} required />
                        </div>
                        {errorPname && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{errorPname}</p>}

                        {/* Campo Descrição do Produto com Validação */}
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Descrição do Produto" type="text" value={pdesc} onChange={(e) => { setPdesc(e.target.value); testInput('pdesc', e.target.value); }} required />
                        </div>
                        {errorPdesc && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{errorPdesc}</p>}

                        <div className="form-input-wrap">
                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="">Selecione uma Categoria</option>
                                {categories.map((item, index) => (<option key={index} value={item}>{item}</option>))}
                            </select>
                        </div>
                        <div className="form-input-wrap">
                            <label style={{ display: 'block', width: '100%', color: '#999999', padding: '0 0 10px 15px' }}>Imagem Principal do Produto</label>
                            <input className="form-input" type="file" onChange={(e) => setPimage(e.target.files[0])} required />
                        </div>
                        <div className="form-input-wrap">
                            <label style={{ display: 'block', width: '100%', color: '#999999', padding: '0 0 10px 15px' }}>Segunda Imagem (Opcional)</label>
                            <input className="form-input" type="file" onChange={(e) => setPimage2(e.target.files[0])} />
                        </div>

                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="submit" className="form-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adicionando produto...' : 'Adicionar Produto'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProductPage;