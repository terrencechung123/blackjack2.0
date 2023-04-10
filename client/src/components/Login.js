import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";

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

    return (
        <div className='login-div'>
            <h1>{signup?'Create An Account':'Login'}</h1>
            <h2 style={{color:'red'}}> {formik.errors.username}</h2>
            {error&& <h2 style={{color:'red'}}> {error}</h2>}
            <form onSubmit={formik.handleSubmit}>
                <label >Username</label>
                <input type="text"  name="username" value={formik.values.username} onChange={formik.handleChange} />
                <label >Password</label>
                <input type="password"  name="password" value={formik.values.password} onChange={formik.handleChange} />
                <input type='submit' value={signup?'Create Account':'Log In'} />
            </form>
            <button onClick={handleClick}>{signup?'Already have an account? Log in':'Don\'t have an account? Sign up'}</button>

        </div>
    );
}

export default Login;