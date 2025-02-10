import React, { useState } from 'react';
import md5 from 'md5';
import axios from 'axios';
import './App.css'; // Reference to the new regular CSS file

function App() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const apiUrl = import.meta.env.VITE_API_URL;
        console.log(apiUrl);

        try {
            const passwordHash = md5(password);
            const response = await axios.post(`${apiUrl}/login`, {
                userid,
                password_hash: passwordHash,
            });
            setData(response.data);
            setShowLogin(false);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchAgain = () => {
        setData([]);
        setShowLogin(true);
        setUserid('');
        setPassword('');
    };

    return (
        <div className='app-container'>
            <div className='login-form'>
                <h1 className='heading'>
                    {/* {showLogin ? 'Login to OCS - IIT Delhi' : 'OCS - IIT Delhi'} */}
                    <img
                        className='image'
                        src='https://ocs.iitd.ac.in/ocs/assets/img/logo/full_color.png'
                    ></img>
                </h1>
                {showLogin ? (
                    <form onSubmit={handleSubmit} className='form'>
                        <div className='input-container'>
                            <input
                                type='text'
                                value={userid}
                                onChange={(e) => setUserid(e.target.value)}
                                placeholder='User ID'
                                required
                                className='input'
                            />
                        </div>
                        <div className='input-container'>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                                className='input'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={loading}
                            className='submit-btn'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    ''
                )}

                {error && <p className='error'>{error}</p>}

                {data.length > 0 && (
                    <div>
                        <table className='data-table'>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Hashed Password</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user) => (
                                    <tr key={user.userid}>
                                        <td>{user.userid}</td>
                                        <td>{user.password_hash}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type='submit'
                            onClick={handleFetchAgain}
                            className='submit-btn flex'
                        >
                            {' '}
                            Fetch Again{' '}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
