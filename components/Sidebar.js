import Link from "next/link";
import styles from "../styles/Sidebar.module.css"
import Image from "next/image";
import Head from "next/head";

export default function Sidebar() {

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image className={styles.logo} src='https://lojaqueroquero.vtexassets.com/assets/vtex.file-manager-graphql/images/9ab2d4be-0913-4a93-bb23-0f407b34324d___95a0c9e10947f4f06c72dcbdad1cd104.svg'
                    layout='responsive'
                    width={400}
                    height={200}>
                </Image>
            </div>
            <div className={styles.ul}>
                <ul>
                    <li><Link href='/dashboard' className={styles.link}><i class="bi bi-pie-chart-fill"></i>Dashboard</Link></li>
                    <li><Link href='/activities' className={styles.link}><i class="bi bi-pen-fill"></i>Atividades</Link></li>
                    <li><Link href='/profile' className={styles.link}><i class="bi bi-person-fill"></i>Perfil</Link></li>
                </ul>
            </div>
        </div>
    )

}