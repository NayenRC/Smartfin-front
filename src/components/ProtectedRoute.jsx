import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch('/auth/profile')
      .then(setProfile)
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
      });
  }, []);

  if (!profile) return <p>Cargando...</p>;

  return <h1>Hola {profile.user.email}</h1>;
}
