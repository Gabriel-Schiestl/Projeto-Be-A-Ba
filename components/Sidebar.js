import Link from "next/link";
import styles from "../styles/Sidebar.module.css"
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Modal from 'react-modal';
import { getSession } from "next-auth/react";
import Loading from "./Loading";

export default function Sidebar() {


    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuRef = useRef(null);
    const [signOutModalOpen, setSignOutModalOpen] = useState(false);
    const [session, setSession] = useState();
    const [name, setName] = useState("");
    const [selected, setSelected] = useState("");
    const [initials, setInitials] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedSelectedItem = localStorage.getItem('selectedSidebarItem');
        if (savedSelectedItem) setSelected(savedSelectedItem);
    }, []);

    const handleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {

        const fetchSession = async () => {

            const session = await getSession();

            setSession(session);

            if (session) {

                const splitedName = session.user.name.split(' ');

                setName(splitedName[0] + " " + splitedName[splitedName.length - 1]);

                setInitials(splitedName[0][0] + splitedName[splitedName.length - 1][0])
            }

        }

        fetchSession();

    }, []);

    useEffect(() => {

        const sidebar = sidebarRef.current;
        const menuButton = menuRef.current;

        if (isOpen) {
            sidebar.classList.add(styles.flex);
            menuButton.classList.add(styles.none);
        } else {
            sidebar.classList.remove(styles.flex);
            menuButton.classList.remove(styles.none)
        }

    }, [isOpen]);

    const handleSignOut = async () => {

        setLoading(true);
        await signOut();

    }

    const handleItemClick = (item) => {
        setSelected(item);
        localStorage.setItem('selectedSidebarItem', item);
    }

    return (
        <>
            <div className={styles.menu}
                onClick={handleMenu}
                ref={menuRef}>
                <i class="bi bi-list"></i>
            </div>
            <div ref={sidebarRef} className={styles.sidebar}>
                <div>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo}
                            alt="Logo Quero-Quero"
                            src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                            layout='responsive'
                            width={400}
                            height={200}>
                        </Image>
                    </div>
                    <div className={styles.ul}>
                        <ul>
                            <li><Link
                                href='/dashboard'
                                className={`${styles.link} ${selected === 'dashboard' ? styles.selected : ''}`}
                                onClick={() => handleItemClick('dashboard')}>
                                <i class="bi bi-pie-chart-fill"></i>Dashboard</Link></li>
                            <li><Link
                                onClick={() => handleItemClick('profiles')}
                                href='/newProfile'
                                className={`${styles.link} ${selected === 'profiles' ? styles.selected : ''}`}
                            >
                                <i class="bi bi-people-fill"></i>Gerenciar perfis</Link></li>
                            <li><Link
                                href='/newFunction'
                                className={`${styles.link} ${selected === 'functions' ? styles.selected : ''}`}
                                onClick={() => handleItemClick('functions')}>
                                <i class="bi bi-tools"></i>Gerenciar funções</Link></li>
                            <li><Link
                                href='/newTransaction'
                                className={`${styles.link} ${selected === 'transactions' ? styles.selected : ''}`}
                                onClick={() => handleItemClick('transactions')}>
                                <i class="bi bi-gear-fill"></i>Gerenciar transações</Link></li>
                            <li><Link
                                href='/newModule'
                                className={`${styles.link} ${selected === 'modules' ? styles.selected : ''}`}
                                onClick={() => handleItemClick('modules')}>
                                <i class="bi bi-folder-fill"></i>Gerenciar módulos</Link></li>
                            <li><Link
                                href='/newUser'
                                className={`${styles.link} ${selected === 'users' ? styles.selected : ''}`}
                                onClick={() => handleItemClick('users')}>
                                <i class="bi bi-person-lines-fill"></i>Gerenciar usuários</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.profileInformations}>
                    <div className={styles.profile}>
                        <div className={styles.picture}>{initials}</div>
                        <div className={styles.informations}>
                            {session && (
                                <>
                                    <div>{name}</div>
                                    <div>{session.user.register}</div>
                                </>
                            )}
                        </div>
                        <i
                            class="bi bi-box-arrow-in-right"
                            onClick={() => setSignOutModalOpen(true)}></i>
                    </div>
                </div>
                <Modal
                    isOpen={signOutModalOpen}
                    onRequestClose={() => setSignOutModalOpen(false)}
                    contentLabel="Sair da conta?"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <div>
                        <h2>Tem certeza que deseja sair da conta?</h2>
                        <p>Esta ação fará com que seja necessário inserir novamente suas credenciais para login!</p>
                    </div>
                    <div className={styles.buttonsDiv}>
                        <button type="button" onClick={() => setSignOutModalOpen(false)}>Cancelar</button>
                        <button className={styles.confirmBtn} type="button" onClick={handleSignOut}>Sair</button>
                    </div>
                </Modal>
            </div>
            {loading && 
                <Loading></Loading>
            }
        </>
    )

}