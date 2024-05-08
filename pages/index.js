import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Login() {

    const [data, setData] = useState({
        userName: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        userNameError: "",
        passwordError: ""
    });

    function handleSubmit(e) {

        e.preventDefault();

        setErrors(prevErrors => ({
            ...prevErrors,
            userNameError: data.userName === "" || data.userName.length < 3 ? "Digite um usuário válido" : "",
            passwordError: data.password === "" || data.password.length < 8 || data.password.length > 20 ? "A senha deve conter entre 8 e 20 caracteres" : ""
        }));
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.div}>
            <h1 style={{ fontFamily: 'Inter', fontSize: '38.32px', fontWeight: 'bold', paddingTop: '7%', marginLeft: '8.5vw' }}>Iniciar sessão na VerdeCard</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.user}>
                    <label>Nome de usuário</label>
                    <input type="email" value={data.userName} onChange={(e) => { setData({ ...data, userName: e.target.value }) }}></input>
                </div>
                {errors.userNameError && <div className={styles.userNameFlash}>{errors.userNameError}</div>}
                <div className={styles.password}>
                    <label>Senha</label>
                    <input type="password" value={data.password} onChange={(e) => { setData({ ...data, password: e.target.value }) }}></input>
                </div>
                {errors.passwordError && <div className={styles.passwordFlash}>{errors.passwordError}</div>}
                <div className={styles.keepConn}>
                    <input type='checkbox'></input>
                    <label>Manter-se conectado</label>
                </div>
                <button onClick={handleSubmit}>Login</button>
                <Link className={styles.link} href='/forgotPassword'>Esqueceu a senha?</Link>
            </form>
            </div>
            <Image className={styles.image} src='/michel.png' width={300} height={300}></Image>
            <footer className={styles.footer}></footer>
        </div>
    )
}