import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Para exibir mensagens de erro

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envia as credenciais para o backend
            const response = await axios.post('http://localhost:3001/api/login', {
                email,
                password,
            });
            onLogin(response.data); // Chama a função de login com os dados do usuário
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Email ou senha incorretos.');
            } else {
                setError('Erro no servidor. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
