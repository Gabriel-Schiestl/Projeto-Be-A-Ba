import { useState } from 'react';
import styles from '../../styles/recoverPassword.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import validator from 'validator';
import axios from 'axios';
import Loading from 'components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

export default function Recovery() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validator.isEmail(email)) {
            setError("Digite um e-mail válido");
        } else {
            setError("");
            setLoading(true);
            try {

                const emailExists = await axios.get(`/api/EmailAPI?email=${email}`);

                if (emailExists.status == 404) {
                    toast.error(emailExists.data.error);
                    setLoading(false);
                    return;
                }

                const userId = emailExists.data.id;

                try {

                    const result = await axios.post('http://127.0.0.1:5000/send-recovery-email', { email });

                    if (result.status == 200) {

                        const response = await axios.post('/api/CodeVerificator', { code: result.data.code });

                        if (response.status == 200) {
                            toast.success("E-mail enviado com sucesso");

                            setTimeout(() => {

                                router.push(`/recoveryPassword/codeVerificator?id=${userId}`);
                            }, 1000);

                        } else {
                            toast.error(response.data.error);
                        }
                    } else {
                        toast.error("Erro ao enviar e-mail");
                    }
                } catch (e) {
                    toast.error("Erro ao enviar código");
                }
            } catch (e) {
                toast.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <Head>
                <title>Recuperação de Senha</title>
                <meta name="passwordRecovery" content="Inserir e-mail para alteração de senha" />
            </Head>
            <div className={styles.container}>
                <header className={styles.header}></header>
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1 className={styles.h1}>Recuperação de senha</h1>
                        <p className={styles.p1}>Para recuperar sua senha, precisaremos que nos informe abaixo, por gentileza, seu
                            e-mail utilizado no momento do cadastro.</p>
                        <div className={styles.email}>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}>
                            </input>
                        </div>
                        {error && <div className={styles.flash}>{error}</div>}
                        <div className={styles.divButton}><button onClick={handleSubmit}>Confirmar</button></div>
                        <div className={styles.divLink}><Link className={styles.link} href='/'>Voltar para a página de Login</Link></div>
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