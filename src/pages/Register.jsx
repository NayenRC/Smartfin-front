import { useState } from 'react';
import { apiFetch } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setMsg(data.message);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Registrarse</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
