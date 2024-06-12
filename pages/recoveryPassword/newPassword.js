import { useState} from 'react'
import styles from '../../styles/recoverPassword.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function newPassword() {
    
    const router = useRouter()

    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [error, setError] = useState("");
    const [differentPassword, setdifferentPassword] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        const {id} = router.query;

        if(password === "" || password.length < 4 || password.length > 20){
            setError("A senha deve conter entre 4 e 20 caracteres");
        } else if(confirmedPassword != password) {
            setError("");
            setdifferentPassword("As senhas não condizem");
        } else {

            const result = await axios.patch('/api/UserAPI', {password, id});

            if(result.status == 500) {
                toast.error(result.data.error);
                return;
            }

            toast.success("Senha atualizada!");

            setTimeout(() => {
                router.push('/recoveryPassword/success');
            }, 2000);            
        }

    }

    return (<>
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.div}>
                <h1 className={styles.h1}>Alteração de senha</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.email}>
                        <label>Nova senha</label>
                        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }}>
                        </input>
                        {error && <div className={styles.flash}>{error}</div>}
                    </div>
                    <div className={styles.email}>
                        <label>Confirme a nova senha</label>
                        <input type="password" value={confirmedPassword} onChange={(e) => { setConfirmedPassword(e.target.value) }}>
                        </input>
                        {differentPassword && <div className={styles.flash}>{differentPassword}</div>}
                    </div>
                    
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