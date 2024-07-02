import Sidebar from "components/Sidebar";
import CheckAuth from "components/CheckAuth";
import { useEffect, useState } from "react";
import styles from 'styles/dashboard.module.css'
import axios from "axios";
import Button from "components/filterButton";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Dashboard() {

    const [data, setData] = useState({ profiles: [], users: [], modules: [], transactions: [], functions: [] });
    const [option, setOption] = useState([]);
    const [imageSrc, setImageSrc] = useState('');
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem('selectedSidebarItem', 'dashboard');
        const handleInit = async () => {

            const session = await getSession();

            if (!session) {
                router.push('/');
                return;
            }

            const [profilesRes, usersRes, modulesRes, transactionsRes, functionsRes] = await Promise.all([
                axios.get('/api/ProfileAPI'),
                axios.get('/api/UserAPI'),
                axios.get('/api/ModuleAPI'),
                axios.get('/api/TransactionAPI'),
                axios.get('/api/FunctionAPI'),
            ]);

            const graphData = {
                profiles: profilesRes.data.length,
                users: usersRes.data.length,
                modules: modulesRes.data.length,
                transactions: transactionsRes.data.length,
                functions: functionsRes.data.length
            }

            await getGraph(graphData);

            setData({ profiles: profilesRes.data, users: usersRes.data, modules: modulesRes.data, transactions: transactionsRes.data, functions: functionsRes.data });
        }

        handleInit();
    }, []);

    const getGraph = async (graphData) => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/graph', graphData, { responseType: 'blob' });

            if (res.status === 200) {
                const imageBlob = res.data;
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImageSrc(imageObjectURL);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleFilter = (option) => {
        switch (option) {
            case 1:
                setOption(data.users);
                return;
            case 2:
                setOption(data.profiles);
                return;
            case 3:
                setOption(data.modules);
                return;
            case 4:
                setOption(data.functions);
                return;
            case 5:
                setOption(data.transactions);
                return;
        }
    }

    const handleDownload = async (attribute) => {
        try {
            const response = await axios.post('/api/Download', { attribute }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${attribute}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="dashboard" content="Dashboards administrativos" />
            </Head>
            <CheckAuth>
                <div className={styles.container}>
                    <Sidebar></Sidebar>
                    <div className={styles.content}>
                        <div className={styles.center}>
                            <div className={styles.subPages}>
                                <div className={styles.div}><h1>Usuários:</h1><h2>{data.users.length}</h2>
                                    <i class="bi bi-download" onClick={() => handleDownload('Users')}></i></div>
                                <div className={styles.div}><h1>Perfis:</h1><h2>{data.profiles.length}</h2>
                                    <i class="bi bi-download" onClick={() => handleDownload('Profiles')}></i></div>
                                <div className={styles.div}><h1>Módulos:</h1><h2>{data.modules.length}</h2>
                                    <i class="bi bi-download" onClick={() => handleDownload('Modules')}></i></div>
                                <div className={styles.div}><h1>Funções:</h1><h2>{data.functions.length}</h2>
                                    <i class="bi bi-download" onClick={() => handleDownload('Functions')}></i></div>
                                <div className={styles.div}><h1>Transações:</h1><h2>{data.transactions.length}</h2>
                                    <i class="bi bi-download" onClick={() => handleDownload('Transactions')}></i></div>
                            </div>
                            <div className={styles.centerContent}>
                                <div className={styles.page}>
                                    {data && option && (
                                        <table className={styles.table}>
                                            <h1>Listagem:</h1>
                                            {option.map(option => <tr>{option.name}</tr>)}
                                        </table>
                                    )}
                                </div>
                                <div className={styles.graph}>
                                    {imageSrc ? <div className={styles.graphImg}><Image src={imageSrc} alt="Graph" width={600} height={600} layout="Intrinsic"></Image></div> : ""}
                                </div>
                            </div>
                            <div className={styles.btns}>
                                <Button text='Listar usuários' onClick={() => handleFilter(1)}></Button>
                                <Button text='Listar perfis' onClick={() => handleFilter(2)}></Button>
                                <Button text='Listar módulos' onClick={() => handleFilter(3)}></Button>
                                <Button text='Listar funções' onClick={() => handleFilter(4)}></Button>
                                <Button text='Listar transações' onClick={() => handleFilter(5)}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CheckAuth>
        </>
    )
}