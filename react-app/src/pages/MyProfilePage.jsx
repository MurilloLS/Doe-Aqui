import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import '../pages/styles/AuthForm.css';      
import '../pages/styles/FormControls.css';  
import '../pages/styles/ProfilePage.css';   

function MyProfilePage() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        
        userService.getMyProfile()
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                }
            })
            .catch((err) => alert(err.response?.data?.message || 'Erro no servidor.'));
    }, [navigate]);

    return (
        <div>
            <Header />
            <div className="auth-container" style={{ minHeight: 'auto', background: 'transparent' }}>
                <div className="auth-wrap" style={{width: '700px'}}>
                    <div className="auth-form">
                        <span className="auth-form-title">
                            O Meu Perfil
                        </span>

                        <div className="profile-details">
                            <div className="profile-field">
                                <span className="profile-label">Nome de Usuario</span>
                                <span className="profile-value">{user.username || '-'}</span>
                            </div>

                            <div className="profile-field">
                                <span className="profile-label">Email</span>
                                <span className="profile-value">{user.email || '-'}</span>
                            </div>

                            <div className="profile-field">
                                <span className="profile-label">Telefone</span>
                                <span className="profile-value">{user.mobile || '-'}</span>
                            </div>
                            
                            <div className="profile-field">
                                <span className="profile-label">Documento (CPF/CNPJ)</span>
                                <span className="profile-value">{user.document || '-'}</span>
                            </div>

                            <div className="profile-field">
                                <span className="profile-label">Tipo de Conta</span>
                                <span className="profile-value">{user.user_type || '-'}</span>
                            </div>

                            <div className="profile-field">
                                <span className="profile-label">Localização</span>
                                <span className="profile-value">{`${user.location_city || ''}, ${user.location_state || ''}`.replace(/^,|,$/g, '') || '-'}</span>
                            </div>
                        </div>

                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="button" className="form-btn" onClick={() => navigate('/edit-profile')}>
                                    Editar Perfil
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfilePage;