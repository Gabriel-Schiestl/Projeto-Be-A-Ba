import { useRouter } from "next/router"
import styles from '../../styles/recoverPassword.module.css'
import Image from 'next/image'
import Head from "next/head"

export default function Success() {

    const router = useRouter()

    function redirect() {
        router.push('/')
    }

    return (
        <>
            <Head>
                <title>Sucesso</title>
                <meta name="success" content="Senha alterada com sucesso" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.div}>
                    <h1 className={styles.h1} style={{ marginLeft: '4vw' }}>Alteração de senha bem sucedida!</h1>
                    <p className={styles.p3}>Avance para a página de login para acessar sua conta!</p>
                    <button onClick={redirect}>Avançar</button>
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