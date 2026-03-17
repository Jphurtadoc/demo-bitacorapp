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
  Fade,
  CircularProgress
} from '@mui/material';
import { 
  Mail, 
  Visibility, 
  VisibilityOff, 
  ContentCopy, 
  Check, 
  Close
} from '@mui/icons-material';
import logoImg from '@/assets/bitacorapp-logo.png';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  authRepository: AuthRepository;
}

const Login: React.FC<LoginProps> = ({ authRepository }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDemoAlert, setShowDemoAlert] = useState(true);

  const navigate = useNavigate();

  const DEMO_EMAIL = 'bitacorapp@demo.answertic.co';
  const DEMO_PASSWORD = 'Admin123*';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authRepository.login(email, password);
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
        padding: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
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
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 400,
          height: 400,
          bgcolor: 'rgba(39, 43, 96, 0.2)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <Box 
        className="login-card animate-fade-in"
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          p: 4, // 32px (equivalente a p-8)
          borderRadius: 6, // 24px (equivalente a rounded-3xl)
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // equivalent to shadow-2xl
        }}
        autoComplete="off"
        component="form"
        onSubmit={handleLogin}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <img src={logoImg} alt="Bitacorapp" style={{ width: 180, marginBottom: 24 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#272b60' }}>
            Ingreso al Sistema
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Gestiona tu bitácora de forma inteligente
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#1e214a' },
              boxShadow: '0 8px 16px rgba(39, 43, 96, 0.2)'
            }}
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

      {/* Demo Alert at bottom right */}
      <Fade in={showDemoAlert}>
        <Box 
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 100,
            width: 320,
            bgcolor: 'white',
            p: 2,
            borderRadius: 3,
            boxShadow: '0 12px 32px -4px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 1.5, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            pb: 1 
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#272b60' }}>
              🚀 Acceso Demo
            </Typography>
            <IconButton size="small" onClick={() => setShowDemoAlert(false)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                p: 1, 
                borderRadius: 2, 
                cursor: 'pointer', 
                bgcolor: '#f8fafc', // slate-50
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#fed7aa' }, // slate-100, orange-200
                transition: 'all 0.2s',
                border: '1px solid transparent'
              }}
              onClick={() => copyToClipboard(DEMO_EMAIL, 'email')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Usuario</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{DEMO_EMAIL}</Typography>
              </Box>
              {copied === 'email' ? <Check sx={{ fontSize: 16, color: 'success.main' }} /> : <ContentCopy sx={{ fontSize: 16, color: 'text.disabled' }} />}
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                p: 1, 
                borderRadius: 2, 
                cursor: 'pointer', 
                bgcolor: '#f8fafc', // slate-50
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#fed7aa' }, // slate-100, orange-200
                transition: 'all 0.2s',
                border: '1px solid transparent'
              }}
              onClick={() => copyToClipboard(DEMO_PASSWORD, 'pass')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Clave</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{DEMO_PASSWORD}</Typography>
              </Box>
              {copied === 'pass' ? <Check sx={{ fontSize: 16, color: 'success.main' }} /> : <ContentCopy sx={{ fontSize: 16, color: 'text.disabled' }} />}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Login;
