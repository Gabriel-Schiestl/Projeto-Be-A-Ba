import { useState } from 'react'
import styles from '../../styles/newPassword.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from 'components/Loading'
import Head from 'next/head'

export default function newPassword() {

    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [error, setError] = useState("");
    const [differentPassword, setdifferentPassword] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        const { id } = router.query;

        setLoading(true);

        if (password === "" || password.length < 4 || password.length > 20) {
            setError("A senha deve conter entre 4 e 20 caracteres");
            setLoading(false);
        } else if (confirmedPassword != password) {
            setError("");
            setdifferentPassword("As senhas não condizem");
            setLoading(false);
        } else {

            const result = await axios.patch('/api/UserAPI', { password, id });

            if (result.status == 500) {
                toast.error(result.data.error);
                return;
            }

            toast.success("Senha atualizada!");

            setTimeout(() => {
                router.push('/recoveryPassword/success');
            }, 2000);
        }

    }

    return (
        <>
            <Head>
                <title>Nova senha</title>
                <meta name="newPassword" content="Inserir nova senha para alteração" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>

                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1 className={styles.h1}>Alteração de senha</h1>
                        <div className={styles.email}>
                            <input type="password" placeholder='Nova senha' value={password} onChange={(e) => { setPassword(e.target.value) }}>
                            </input>
                            {error && <div className={styles.flash}>{error}</div>}
                        </div>
                        <div className={styles.email}>
                            <input type="password" placeholder='Confirme a nova senha' value={confirmedPassword} onChange={(e) => { setConfirmedPassword(e.target.value) }}>
                            </input>
                            {differentPassword && <div className={styles.flash}>{differentPassword}</div>}
                        </div>

                        <div className={styles.divButton}><button onClick={handleSubmit}>Confirmar</button></div>
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
                {loading && <Loading></Loading>}
            </div>
        </>
    )
}