import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import { login } from '../features/auth/authSlice'

export default function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { email: '', password: '' } })

    const onSubmit = async (data) => {
        try {
            await dispatch(login(data)).unwrap()
            navigate('/')
        } catch (status) {
            setError('root', {
                message:
                    status === 401
                        ? 'Email o contraseña incorrectos'
                        : 'Ocurrió un error, intentá de nuevo',
            })
        }
    }

    return (
        <Container maxWidth="xs" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ingresar
            </Typography>

            {errors.root && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.root.message}
                </Alert>
            )}

            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
                <TextField
                    label="Email"
                    type="email"
                    {...register('email', { required: 'El email es obligatorio' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Ingresar
                </Button>
            </Stack>

            <Stack spacing={1} sx={{ mt: 2 }}>
                <Link component={RouterLink} to="/forgot-password">
                    Olvidé mi contraseña
                </Link>
                <Link component={RouterLink} to="/registro">
                    Registrarme
                </Link>
            </Stack>
        </Container>
    )
}
