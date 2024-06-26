import { useState, useEffect } from 'react'
import styles from '../../styles/code.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import Loading from 'components/Loading'

export default function Code() {

    const router = useRouter();

    const [code, setCode] = useState("");
    const [sentCode, setSentCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        const getCode = async () => {

            try {
                const result = await axios.get('/api/CodeVerificator');

                if (result.status == 200) {
                    setSentCode(result.data.code);
                } else {
                    toast.error("Erro ao obter código de resgate");
                }

            } catch (e) {
                toast.error(e);
            }
        }

        getCode();

    }, []);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        const { id } = router.query;

        if (code != sentCode) {
            setError("Código inválido");
            setLoading(false);
        } else {
            toast.success("Código validado com sucesso");

            setTimeout(() => {

                router.push(`/recoveryPassword/newPassword?id=${id}`);

            }, 2000);
        }

    }

    return (
        <>
            <Head>
                <title>Código de Verificação</title>
                <meta name="codeVerificator" content="Inserir código de verificação enviado por e-mail" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1 className={styles.h1}>Código de verificação</h1>
                        <p className={styles.p1}>Digite abaixo o código enviado para seu e-mail.</p>
                        <div className={styles.email}>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)}>
                            </input>
                        </div>
                        {error && <div className={styles.flash}>{error}</div>}
                        <div className={styles.divButton}><button onClick={handleSubmit}>Confirmar</button></div>
                    </form>
                </div>
                <div className={styles.images}>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo} src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                            layout='intrinsic'
                            width={600}
                            height={400}>
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