import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Trimite access_token la backend Flask
        const response = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Salvează JWT token în localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect la dashboard/home
          navigate('/dashboard');
        } else {
          console.error('Login failed:', data.error);
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during Google login:', error);
        alert('Something went wrong. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      alert('Google login failed. Please try again.');
    },
  });

  return { googleLogin };
};