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
  PersonOutline,
  Visibility, 
  VisibilityOff
} from '@mui/icons-material';
import { ThemeModeSegment } from '@/components/UI/theme';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  authRepository: AuthRepository;
}

const getPostLoginPath = (role: string): string => {
  if (role === 'root' || role === 'admin') {
    return '/dashboard';
  }
  if (role === 'vigilante') {
    return '/vigilancia/turno';
  }
  return '/dashboard';
};

const Login: React.FC<LoginProps> = ({ authRepository }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { isDark } = useTheme();

  React.useEffect(() => {
    const savedUsername = localStorage.getItem('remember_username');
    const savedPassword = localStorage.getItem('remember_password');
    const savedRemember = localStorage.getItem('remember_me') === 'true';

    if (savedRemember && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authRepository.login(username, password);

      if (rememberMe) {
        localStorage.setItem('remember_username', username);
        localStorage.setItem('remember_password', password);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_username');
        localStorage.removeItem('remember_password');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('remember_email');
      }

      navigate(getPostLoginPath(user.role));
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

  const autofillSx = isDark
    ? {
        WebkitTextFillColor: '#e8eaef',
        caretColor: '#e8eaef',
        transition: 'background-color 99999s ease-out 0s',
        boxShadow: '0 0 0 1000px rgba(12, 14, 20, 0.95) inset',
      }
    : {
        WebkitTextFillColor: '#0f172a',
        caretColor: '#0f172a',
        transition: 'background-color 99999s ease-out 0s',
        boxShadow: '0 0 0 1000px #ffffff inset',
      };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': autofillSx,
      ...(isDark && {
        color: '#e8eaef',
        backgroundColor: 'rgba(12, 14, 20, 0.55)',
        '& fieldset': { borderColor: 'rgba(255, 143, 71, 0.28)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 143, 71, 0.45)' },
        '&.Mui-focused fieldset': { borderColor: '#ff8f47' },
      }),
    },
    ...(isDark && {
      '& .MuiInputLabel-root': { color: 'rgba(232, 234, 239, 0.65)' },
      '& .MuiInputLabel-root.Mui-focused': { color: '#ff8f47' },
      '& .MuiInputAdornment-root, & .MuiIconButton-root': { color: 'rgba(232, 234, 239, 0.7)' },
    }),
  };

  return (
    <Box 
      className="login-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDark ? '#0c0e14' : '#272B61',
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
          bgcolor: isDark ? 'rgba(255, 143, 71, 0.22)' : 'rgba(255, 143, 71, 0.12)',
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
          bgcolor: isDark ? 'rgba(91, 103, 199, 0.12)' : 'rgba(91, 103, 199, 0.35)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
        style={{ borderRadius: '50%' }}
      />

      <Box 
        className="login-card animate-fade-in"
        sx={{
          width: '100%',
          maxWidth: 560,
          bgcolor: isDark ? 'rgba(22, 26, 36, 0.92)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          ...(isDark && {
            border: '1px solid rgba(255, 143, 71, 0.22)',
          }),
        }}
        style={{ padding: '48px 44px', borderRadius: '24px' }}
        autoComplete="off"
        component="form"
        onSubmit={handleLogin}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} style={{ marginBottom: '40px' }}>
          <img
            src={isDark ? '/logo_secondary.svg' : '/logo.svg'}
            alt="Bitacorapp"
            style={{ width: 220, marginBottom: 24 }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#272B61' }}
          >
            Ingreso al Sistema
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: isDark ? 'rgba(232, 234, 239, 0.65)' : 'text.secondary', mt: 1 }}
          >
            Gestiona tu bitácora de forma inteligente
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }} style={{ gap: '20px' }}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            inputProps={{ 'aria-label': 'Usuario' }}
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutline sx={{ color: isDark ? 'rgba(232, 234, 239, 0.7)' : 'action.active' }} />
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
            sx={fieldSx}
            inputProps={{ 'aria-label': 'Contraseña' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                  >
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
                    color: '#ff8f47', 
                    '&.Mui-checked': { color: '#ff8f47' } 
                  }} 
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: isDark ? 'rgba(232, 234, 239, 0.85)' : 'inherit' }}
                >
                  Mantener sesión
                </Typography>
              }
              sx={{ m: 0 }}
            />
            <Button variant="text" size="small" sx={{ fontWeight: 600, color: '#ff8f47', textTransform: 'none' }}>
              ¿Problemas?
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              bgcolor: '#ff8f47',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#f07830' },
              boxShadow: '0 8px 16px rgba(255, 143, 71, 0.28)'
            }}
            style={{ paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
              ...(isDark && {
                bgcolor: 'rgba(239, 68, 68, 0.12)',
                color: '#fecaca',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                '& .MuiAlert-icon': { color: '#f87171' },
              }),
            }}
          >
            {error}
          </Alert>
        )}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          zIndex: 20,
          width: 148,
        }}
      >
        <ThemeModeSegment
          size="sm"
          className={`!w-full shadow-lg ring-1 ${isDark ? 'ring-primary/30' : 'ring-white/20'}`}
        />
      </Box>
    </Box>
  );
};

export default Login;
