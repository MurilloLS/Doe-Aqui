import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import '../pages/styles/AuthForm.css'; 
import '../pages/styles/FormControls.css'; 

function EditProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [password, setPassword] = useState('');
    const [newProfilePic, setNewProfilePic] = useState(null);

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
            .catch((err) => alert(err.response?.data?.message || 'Erro ao buscar dados do perfil.'));
    }, [navigate]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('mobile', user.mobile);
        formData.append('email', user.email);
        formData.append('document', user.document);
        formData.append('location_city', user.location_city);
        formData.append('location_state', user.location_state);

        if (password) {
            formData.append('password', password);
        }

        if (newProfilePic) {
            formData.append('profilePic', newProfilePic);
        }

        userService.updateUser(formData)
            .then((res) => {
                alert(res.data.message);
                navigate('/my-profile');
            })
            .catch((err) => {
                console.error("Erro ao atualizar o perfil:", err.response);
                alert(err.response?.data?.message || 'Erro no servidor ao atualizar perfil.');
            });
    };

    return (
        <div>
            <Header />
            <div className="auth-container" style={{ minHeight: 'auto', background: 'transparent' }}>
                <div className="auth-wrap" style={{width: '700px'}}>
                    <form className="auth-form" onSubmit={handleUpdate}>
                        <span className="auth-form-title">Editar Perfil</span>
                        
                        <div className="form-input-wrap"><input className="form-input" placeholder="Nome de Usuario" type="text" name="username" value={user.username || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Telefone" type="text" name="mobile" value={user.mobile || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Email" type="email" name="email" value={user.email || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Documento (CPF/CNPJ)" type="text" name="document" value={user.document || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Cidade" type="text" name="location_city" value={user.location_city || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Estado" type="text" name="location_state" value={user.location_state || ''} onChange={handleInputChange} /></div>
                        <div className="form-input-wrap"><input className="form-input" placeholder="Nova Password (deixar em branco para manter)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>

                        <div className="form-input-wrap">
                            <label style={{display: 'block', width: '100%', color: '#999999', padding: '0 0 10px 15px'}}>Nova Foto de Perfil (Opcional)</label>
                            <input className="form-input" type="file" onChange={(e) => setNewProfilePic(e.target.files[0])} />
                        </div>

                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="submit" className="form-btn">Atualizar Perfil</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;