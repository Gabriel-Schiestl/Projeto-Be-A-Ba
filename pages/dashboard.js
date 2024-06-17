import Sidebar from "components/Sidebar";
import CheckAuth from "components/CheckAuth";
import { useEffect, useState } from "react";
import styles from 'styles/dashboard.module.css'
import axios from "axios";
import Button from "components/filterButton";

export default function Dashboard() {

    const [data, setData] = useState({ profiles: [], users: [], modules: [], transactions: [], functions: [] });
    const [option, setOption] = useState([]);

    useEffect(() => {
        localStorage.setItem('selectedSidebarItem', 'dashboard');
        const handleInit = async () => {
            const [profilesRes, usersRes, modulesRes, transactionsRes, functionsRes] = await Promise.all([
                axios.get('/api/ProfileAPI'),
                axios.get('/api/UserAPI'),
                axios.get('/api/ModuleAPI'),
                axios.get('/api/TransactionAPI'),
                axios.get('/api/FunctionAPI'),
            ]);

            setData({ profiles: profilesRes.data, users: usersRes.data, modules: modulesRes.data, transactions: transactionsRes.data, functions: functionsRes.data });
        }

        handleInit();
    }, []);

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

    return (
        <CheckAuth>
            <div className={styles.container}>
                <Sidebar></Sidebar>
                <div className={styles.content}>
                    <div className={styles.center}>
                        <div className={styles.subPages}>
                            <div><h1>Usuários:</h1><h2>{data.users.length}</h2></div>
                            <div><h1>Perfis:</h1><h2>{data.profiles.length}</h2></div>
                            <div><h1>Módulos:</h1><h2>{data.modules.length}</h2></div>
                            <div><h1>Funções:</h1><h2>{data.functions.length}</h2></div>
                            <div><h1>Transações:</h1><h2>{data.transactions.length}</h2></div>
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
                                <h1>Gráfico:</h1>
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
    )
}