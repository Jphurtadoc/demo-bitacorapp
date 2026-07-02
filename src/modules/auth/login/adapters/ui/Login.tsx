import React, { useState } from 'react';
import type { AuthRepository } from '@/modules/auth/login/infrastructure/AuthRepository';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  InputAdornment, 
  TextField, 
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Mail, 
  Visibility, 
  VisibilityOff
} from '@mui/icons-material';
import logoImg from '@/assets/bitacorapp-logo.png';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  authRepository: AuthRepository;
}

const Login: React.FC<LoginProps> = ({ authRepository }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Load saved credentials on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    const savedPassword = localStorage.getItem('remember_password');
    const savedRemember = localStorage.getItem('remember_me') === 'true';

    if (savedRemember && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authRepository.login(email, password);
      
      // Save or clear credentials based on rememberMe
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
        localStorage.setItem('remember_password', password);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_email');
        localStorage.removeItem('remember_password');
        localStorage.removeItem('remember_me');
      }

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      className="login-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1a1d3d', // Darker variation of secondary
        position: 'relative',
        overflow: 'hidden'
      }}
      style={{ padding: '24px' }}
    >
      {/* Background Blobs (keeping some decorative elements) */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 500,
          height: 500,
          bgcolor: 'rgba(255, 118, 28, 0.05)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
        style={{ borderRadius: '50%' }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 400,
          height: 400,
          bgcolor: 'rgba(39, 43, 96, 0.2)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
        style={{ borderRadius: '50%' }}
      />

      <Box 
        className="login-card animate-fade-in"
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // equivalent to shadow-2xl
        }}
        style={{ padding: '32px', borderRadius: '24px' }}
        autoComplete="off"
        component="form"
        onSubmit={handleLogin}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} style={{ marginBottom: '40px' }}>
          <img src={logoImg} alt="Bitacorapp" style={{ width: 180, marginBottom: 24 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#272b60' }}>
            Ingreso al Sistema
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Gestiona tu bitácora de forma inteligente
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }} style={{ gap: '20px' }}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Mail sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ 
                    color: '#ff761c', 
                    '&.Mui-checked': { color: '#ff761c' } 
                  }} 
                />
              }
              label={<Typography variant="body2">Mantener sesión</Typography>}
              sx={{ m: 0 }}
            />
            <Button variant="text" size="small" sx={{ fontWeight: 600, color: '#ff761c', textTransform: 'none' }}>
              ¿Problemas?
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              bgcolor: '#272b60',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#1e214a' },
              boxShadow: '0 8px 16px rgba(39, 43, 96, 0.2)'
            }}
            style={{ paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Login;
