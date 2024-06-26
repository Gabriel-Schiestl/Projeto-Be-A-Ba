import { useRouter } from "next/router"
import styles from '../../styles/newPassword.module.css'
import Image from 'next/image'
import Head from "next/head"

export default function Success() {

    const router = useRouter()

    const redirect = (e) => {
        e.preventDefault();
        router.push('/');
    }

    return (
        <>
            <Head>
                <title>Sucesso</title>
                <meta name="success" content="Senha alterada com sucesso" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={redirect}>
                        <h1 className={styles.h1} style={{ marginLeft: '4vw' }}>Alteração de senha bem sucedida!</h1>
                        <p className={styles.p1}>Avance para a página de login para acessar sua conta!</p>
                        <div className={styles.divButton}><button type="submit">Avançar</button></div>
                    </form>
                </div>
                <div className={styles.images}>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo} src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                            layout='intrinsic'
                            width={700}
                            height={500}>
                        </Image>
                    </div>
                    <div className={styles.michel}>
                        <Image className={styles.img} src='/michel_card.png'
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