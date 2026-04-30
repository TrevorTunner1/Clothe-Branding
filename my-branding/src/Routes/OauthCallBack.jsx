// pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const { oauthCallback } = useAuthStore();

    useEffect(() => {
        oauthCallback().then(({ success }) => {
            if (success) navigate('/platfrom/shop');
            else navigate('/login?error=oauth_failed');
        });
    }, []);

    return <p>Signing you in...</p>;
}