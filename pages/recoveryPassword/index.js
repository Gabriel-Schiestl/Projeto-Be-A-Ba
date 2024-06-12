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

            try {

                const emailExists = await axios.get(`/api/UserAPI?email=${email}`);

                if (emailExists.status == 404) {
                    toast.error(emailExists.data.error);
                    return;
                }

                const userId = emailExists.data.id;

                const result = await axios.post('http://127.0.0.1:5000/send-recovery-email', { email });

                if (result.status == 200) {
                    setLoading(true);
                    const response = await axios.post('/api/CodeVerificator', {code: result.data.code});

                    if (response.status == 200) {
                        toast.success("E-mail enviado com sucesso");
                        
                        setTimeout(() => {

                            router.push(`/recoveryPassword/codeVerificator?id=${userId}`);
                        }, 2000);

                    } else {
                        toast.error(response.data.error);
                    }
                } else {
                    toast.error("Erro ao enviar e-mail");
                }
            } catch (e) {
                toast.error(e);
            } finally {
                setLoading(false)
            }
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
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value) }>
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
        {loading && <Loading></Loading>}
    </>
    )
}