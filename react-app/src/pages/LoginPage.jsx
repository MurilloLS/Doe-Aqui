import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../services/userService";
import '../pages/styles/AuthForm.css';
import '../pages/styles/FormControls.css'; 

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); 
        userService.login(username, password)
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    navigate('/');
                }
            })
            .catch((err) => {
                alert(err.response?.data?.message || 'Erro no servidor.');
            });
    };

    return (
        <div className="auth-limiter">
            <div className="auth-container">
                <div className="auth-wrap">
                    <form className="auth-form" onSubmit={handleLogin}>
                        <span className="auth-form-title">
                            Bem-vindo de Volta
                        </span>
                        <span className="auth-form-icon">
                            <i className="fa fa-handshake-o" aria-hidden="true"></i>
                        </span>

                        <div className="form-input-wrap">
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Nome de Utilizador"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-input-wrap">
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-btn-container">
                            <div className="form-btn-wrap">
                                <div className="form-btn-bg"></div>
                                <button type="submit" className="form-btn">
                                    Login
                                </button>
                            </div>
                        </div>

                        <div className="bottom-text">
                            <span className="text1">Não tem uma conta?</span>
                            <Link className="text2" to="/signup">Registe-se</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;