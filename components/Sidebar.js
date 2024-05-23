import Link from "next/link";
import styles from "../styles/Sidebar.module.css"
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {

    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuRef = useRef(null);

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

        const sidebar = sidebarRef.current;

        if (isOpen) {
            sidebar.classList.add(styles.flex);
        } else {
            sidebar.classList.remove(styles.flex);
        }

    }, [isOpen]);

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
                            src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                            layout='responsive'
                            width={400}
                            height={200}>
                        </Image>
                    </div>
                    <div className={styles.ul}>
                        <ul>
                            <li><Link href='/dashboard' className={styles.link}><i class="bi bi-pie-chart-fill"></i>Dashboard</Link></li>
                            <li><Link href='/profile' className={styles.link}><i class="bi bi-person-fill"></i>Perfil</Link></li>
                            <li><Link href='/newProfile' className={styles.link}><i class="bi bi-people-fill"></i>Gerenciar perfis</Link></li>
                            <li><Link href='/newFunction' className={styles.link}><i class="bi bi-tools"></i>Gerenciar funções</Link></li>
                            <li><Link href='/newTransaction' className={styles.link}><i class="bi bi-gear-fill"></i>Gerenciar transações</Link></li>
                            <li><Link href='/newModule' className={styles.link}><i class="bi bi-folder-fill"></i>Gerenciar módulos</Link></li>
                            <li><Link href='/newUser' className={styles.link}><i class="bi bi-person-lines-fill"></i>Gerenciar usuários</Link></li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div className={styles.profile}>
                        <div className={styles.picture}>GS</div>
                        <div className={styles.informations}>
                            <div>Gabriel Schiestl</div>
                            <div>980216</div>
                        </div>
                        <i class="bi bi-box-arrow-in-right"></i>
                    </div>
                </div>
            </div>
        </>
    )

}