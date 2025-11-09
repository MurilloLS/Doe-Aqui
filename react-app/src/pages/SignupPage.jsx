import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../services/userService";
import '../pages/styles/AuthForm.css';
import '../pages/styles/FormControls.css';

function SignupPage() {
    const navigate = useNavigate();
    
    // Estados dos campos do formulário
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [userType, setUserType] = useState('INDIVIDUAL');
    const [document, setDocument] = useState('');
    const [locationCity, setLocationCity] = useState('');
    const [locationState, setLocationState] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    // --- LÓGICA DE VALIDAÇÃO ADICIONADA ---
    const [errorPhone, setErrorPhone] = useState('');
    const [errorDocument, setErrorDocument] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    function testInput(field, text) {
        let regex;
        switch(field) {
            case 'phone':
                regex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
                !regex.test(text) ? setErrorPhone('Número de telemóvel inválido.') : setErrorPhone('');
                break;
            case 'document':
                regex = /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/;
                !regex.test(text) ? setErrorDocument('Formato de documento inválido (CPF/CNPJ).') : setErrorDocument('');
                break;
            case 'email':
                regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                !regex.test(text) ? setErrorEmail('Formato de email inválido.') : setErrorEmail('');
                break;
            default:
                break;
        }
    }

    function fieldCheck(...vars) {
        return vars.every(v => v !== '');
    }
    // --- FIM DA LÓGICA DE VALIDAÇÃO ---

    const handleSignup = (e) => {
        e.preventDefault();

        // Verifica se os campos estão preenchidos e se não há erros de regex
        if (fieldCheck(username, password, mobile, email, document, locationCity, locationState) && !errorDocument && !errorEmail && !errorPhone) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('mobile', mobile);
            formData.append('email', email);
            formData.append('user_type', userType);
            formData.append('document', document);
            formData.append('location_city', locationCity);
            formData.append('location_state', locationState);
            if (profilePic) {
                formData.append('profilePic', profilePic);
            }

            userService.signup(formData)
                .then((res) => {
                    alert(res.data.message);
                    navigate('/login');
                })
                .catch((err) => {
                    alert(err.response?.data?.message || 'Erro no servidor.');
                });
        } else {
            alert('Utilizador não registado. Verifique se todos os campos estão preenchidos corretamente e sem erros.');
        }
    };

    return (
        <div className="auth-limiter">
            <div className="auth-container">
                <div className="auth-wrap">
                    <form className="auth-form" onSubmit={handleSignup} noValidate>
                        <span className="auth-form-title">Criar Conta</span>

                        <div className="form-input-wrap">
                            <select className="form-select" value={userType} onChange={(e) => setUserType(e.target.value)}>
                                <option value="INDIVIDUAL">Pessoa Física</option>
                                <option value="NGO">ONG</option>
                                <option value="COMPANY">Empresa</option>
                            </select>
                        </div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Nome de Utilizador / Organização" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                        
                        {/* Campo Telemóvel com Validação */}
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Telemóvel" type="tel" value={mobile} onChange={(e) => { setMobile(e.target.value); testInput("phone", e.target.value); }} required />
                        </div>
                        {errorPhone && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{errorPhone}</p>}
                        
                        {/* Campo Email com Validação */}
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); testInput("email", e.target.value); }} required />
                        </div>
                        {errorEmail && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{errorEmail}</p>}
                        
                        <div className="form-input-wrap"><input className="form-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                        
                        {/* Campo Documento com Validação */}
                        <div className="form-input-wrap">
                            <input className="form-input" placeholder="Documento (CPF/CNPJ)" type="text" value={document} onChange={(e) => { setDocument(e.target.value); testInput("document", e.target.value); }} required />
                        </div>
                        {errorDocument && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{errorDocument}</p>}

                        <div className="form-input-wrap"><input className="form-input" placeholder="Cidade" type="text" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} required /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Estado" type="text" value={locationState} onChange={(e) => setLocationState(e.target.value)} required /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Foto de Perfil" type="file" onChange={(e) => setProfilePic(e.target.files[0])} /></div>
                        
                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="submit" className="form-btn">Registar</button>
                            </div>
                        </div>

                        <div className="bottom-text">
                            <span className="text1">Já tem uma conta?</span>
                            <Link className="text2" to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;