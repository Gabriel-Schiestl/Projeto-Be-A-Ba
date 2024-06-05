import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import validator from 'validator'

export default function Login() {

    const router = useRouter();

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        userNameError: "",
        passwordError: "",
    });

    async function handleSubmit(e) {

        e.preventDefault();

        const userNameError = data.email.length < 3 || !validator.isEmail(data.email) ? "Digite um usuário válido" : "";
        const passwordError = data.password.length < 8 || data.password.length > 20 ? "A senha deve conter entre 8 e 20 caracteres" : "";

        if (userNameError || passwordError) {

            setErrors({
                userNameError,
                passwordError,
            });

            return;
        }

        try {

            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password
            })

            if (result.error) {

                console.log("Nao autorizada");

                return;
            }

            router.replace('/newUser');

        } catch (e) {

            console.log(e);

        }
    }

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.content}>
                    <h1 className={styles.h1}>Iniciar sessão na VerdeCard</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.divLabel}><label>Nome de usuário</label></div>
                        <input
                            required
                            type="email"
                            value={data.email}
                            onChange={(e) => { setData({ ...data, email: e.target.value }) }}>
                        </input>
                        {errors.userNameError && <div className={styles.userNameFlash}>{errors.userNameError}</div>}
                        <div className={styles.divLabel}><label>Senha</label></div>
                        <input
                            required
                            type="password"
                            value={data.password}
                            onChange={(e) => { setData({ ...data, password: e.target.value }) }}>
                        </input>
                        {errors.passwordError && <div className={styles.passwordFlash}>{errors.passwordError}</div>}
                        <div className={styles.keepConn}>
                            <input type='checkbox'></input>
                            <label>Manter-se conectado</label>
                        </div>
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
        </>
    )
}