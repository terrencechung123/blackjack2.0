import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";

function Copyright(props){
    return(
        <Typography variant="body2" color ="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                FlatJack
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

function Login({ setUser }) {

    const history = useHistory();
    const [error, setError] = useState('');
    const [signup, setSignup] = useState(false);

    const handleClick = () => setSignup(!signup)

    const formSchema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required()
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(signup?'/signup':'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(user => {
                        setUser(user)
                        if (signup){history.push('/blackjack')}
                        else {history.push('/blackjack')}
                    })
                } else {
                    res.json().then(error => setError(error.message))
                };
            })
        }
    })
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Logo>
                FlatJack
            </Logo>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
                {signup?'Create An Account':'Sign in'}
            </Typography>
        {/* <div className='login-div'> */}
            <h2 style={{color:'red'}}> {formik.errors.username}</h2>
            {error&& <h2 style={{color:'red'}}> {error}</h2>}
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                {/* <label >Username</label> */}
                <TextField
                    margin="normal"
                    type="text"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={formik.values.username}
                    onChange={formik.handleChange} />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange} />
                <Button
                    type='submit'
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    value={signup?'Create Account':'Log In'}
                    >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2" onClick={handleClick}>
                            {signup?"Already have an account? Log in": "Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        {/* </div> */}
        </Box>
        <Copyright sx={{ mt: 8, mb: 4}}/>
        </Container>
        </ThemeProvider>
    );
}

export default Login;

const Logo = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 4rem;
  color: #000;
  margin: 0;
  line-height: 1;
  a {
    color: inherit;
    text-decoration: none;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;