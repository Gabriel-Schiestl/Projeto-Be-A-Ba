import { useState} from 'react'
import styles from '../../styles/recoverPassword.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Code() {

    const router = useRouter();

    const [code, setCode] = useState("");

    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        if(code === "" || code.length < 5) {
            setError("Código inválido")
        } else {
            setError("")
            router.push('/recoveryPassword/newPassword')
        }

    }

    return (<>
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.div}>
                <h1 className={styles.h1}>Código de verificação</h1>
                <p className={styles.p2}>Insira abaixo o código de verificação enviado para o seu e-mail!</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.email}>
                        <label>Código de verificação</label>
                        <input type="text" value={code} onChange={(e) => { setCode(e.target.value) }}>
                        </input>
                    </div>
                    {error && <div className={styles.flash}>{error}</div>}
                    <button onClick={handleSubmit}>Confirmar</button>
                    <Link className={styles.link} style={{marginLeft: '27.8%'}} href='/'>Não recebeu o email?<span style={{marginLeft: '2%', color: '#0000EE'}}>Reenviar</span></Link>
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