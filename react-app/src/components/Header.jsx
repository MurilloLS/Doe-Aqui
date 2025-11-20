import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

function Header(props) {
    const [showOver, setShowOver] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userLoc');
        navigate('/login');
        window.location.reload(); 
    }, [navigate]);

    useEffect(() => {
        if (isLoggedIn) {
            userService.getMyProfile()
                .then(res => {
                    console.log('✅ Perfil recebido:', res.data.user);
                    console.log('🖼️ profilePic:', res.data.user?.profilePic);
                    setUser(res.data.user);
                })
                .catch(err => {
                    console.error("Erro ao buscar dados do perfil para o header:", err);
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        handleLogout();
                    }
                });
        }
    }, [isLoggedIn, handleLogout]);

    return (
        <div className='header-container d-flex justify-content-between'>
            <div className="header">
                <Link className='links' to="/"> HOME </Link>
                <input className='search'
                    type='text'
                    value={props.search || ''}
                    onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)}
                />
                <button className='search-btn' onClick={() => props.handleClick && props.handleClick()} > <FaSearch /> </button>
            </div>
            <div>
                {isLoggedIn && user ? (
                    <>
                        <div onClick={() => setShowOver(!showOver)} style={{ cursor: 'pointer' }}>
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Perfil"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    background: '#002f34', width: '40px', height: '40px',
                                    color: '#fff', fontSize: '14px', borderRadius: '50%'
                                }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {showOver && (
                            <div style={{
                                minHeight: '100px', width: '200px', position: 'absolute',
                                top: '0', right: '0', zIndex: 1, marginTop: '50px',
                                marginRight: '50px',
                                background: '#002f34', borderRadius: '7px'
                            }}>
                                <Link to="/my-profile"><button className="logout-btn">PERFIL</button></Link>
                                <Link to="/add-product"><button className="logout-btn">ADICIONAR PRODUTO</button></Link>
                                <Link to="/liked-products"><button className="logout-btn">FAVORITOS</button></Link>
                                <Link to="/my-products"><button className="logout-btn">MEUS PRODUTOS</button></Link>
                                <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ paddingTop: '5px' }}>
                        <Link to="/login" className="logout-btn" id='login-btn'>LOGIN</Link>
                        <Link to="/signup" className="logout-btn" id='signup-btn'>SIGNUP</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;