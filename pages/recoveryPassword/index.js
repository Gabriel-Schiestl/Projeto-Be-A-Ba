import { useState} from 'react'
import styles from '../../styles/recoverPassword.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Recovery() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    function handleSubmit(e) {

        e.preventDefault();

        //router.push("/recoveryPassword/codeVerificator");

        if (email === "" || email.length < 10) {
            setError("Digite um e-mail válido");
        } else {
            router.push("/recoveryPassword/codeVerificator");
        }
    }

    return (<>
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.div}>
                <h1 className={styles.h1}>Recuperação de senha</h1>
                <p className={styles.p1}>Para recuperar sua senha, precisaremos que nos informe abaixo, por gentileza, seu
                    e-mail utilizado no momento do cadastro.</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.email}>
                        <label>E-mail</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }}>
                        </input>
                    </div>
                    {error && <div className={styles.flash}>{error}</div>}
                    <button onClick={handleSubmit}>Confirmar</button>
                    <Link className={styles.link} href='/'>Voltar para a página de Login</Link>
                </form>
            </div>
            <footer className={styles.footer}></footer>
        </div>
        <div className={styles.image}>
            <Image className={styles.img} src='/michel_card.png'
                layout='responsive'
                width={700}
                height={500}>
            </Image>
        </div>
        <div className={styles.logoContainer}>
            <Image className={styles.logo} src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                layout='responsive'
                width={700}
                height={500}>
            </Image>
        </div>
    </>
    )
}