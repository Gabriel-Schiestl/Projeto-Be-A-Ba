import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import validator from 'validator'
import Loading from 'components/Loading'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'

export default function Login() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        userNameError: "",
        passwordError: "",
    });

    async function handleSubmit(e) {

        e.preventDefault();

        const userNameError = data.email.length < 4 || !validator.isEmail(data.email) ? "Digite um usuário válido" : "";
        const passwordError = data.password.length < 4 ? "Digite uma senha" : "";

        if (userNameError || passwordError) {

            setErrors({
                userNameError,
                passwordError,
            });

            return;
        }

        setLoading(true);
        setErrors("");
        try {

            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (result.status == 401) {

                toast.error(result.error);
                setLoading(false);
                return;
            }

            toast.success("Login autorizado");
            router.replace('/dashboard');

        } catch (e) {
            toast.error("Acesso não autorizado");
        }
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="login" content="Login" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1 className={styles.h1}>Iniciar sessão na VerdeCard</h1>
                        <div className={styles.divLabel}><label>Nome de usuário</label></div>
                        <input
                            required
                            type="email"
                            value={data.email}
                            onChange={(e) => { setData({ ...data, email: e.target.value }) }}>
                        </input>
                        {errors.userNameError && <div className={styles.userNameFlash}>{errors.userNameError}</div>}
                        <div className={styles.divLabel}><label>Senha</label></div>
                        <div className={styles.passwordContainer}>
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => { setData({ ...data, password: e.target.value }) }}>
                            </input>
                            <i
                                className={`${styles.eyeIcon} ${showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                        {errors.passwordError && <div className={styles.passwordFlash}>{errors.passwordError}</div>}
                        <button onClick={handleSubmit}>Login</button>
                        <Link className={styles.link} href='/recoveryPassword'>Esqueceu a senha?</Link>
                    </form>
                </div>
                <div className={styles.images}>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo}
                            alt='Logo Quero-Quero'
                            src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                            layout='intrinsic'
                            width={600}
                            height={400}>
                        </Image>
                    </div>
                    <div className={styles.michel}>
                        <Image className={styles.logo}
                            alt='Michel Teló'
                            src='/michel_card.png'
                            layout='intrinsic'
                            width={700}
                            height={500}>
                        </Image>
                    </div>
                </div>
                <footer className={styles.footer}></footer>
            </div>
            {loading && <Loading></Loading>}
        </>
    )
}