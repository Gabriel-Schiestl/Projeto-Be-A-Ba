import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import CheckAuth from "components/CheckAuth";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';

Modal.setAppElement('body');

export default function NewTransaction() {

    const router = useRouter();
    const [data, setData] = useState({ name: "", tag: "", description: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [errors, setErrors] = useState("");
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {

        handleTransactions();

    }, []);

    const handleTransactions = async () => {

        const session = await getSession();

        if (!session) {
            router.push('/');
            return;
        }

        try {

            const response = await axios.get('/api/TransactionAPI');

            if (response) setTransactions(response.data);

        } catch (e) {
            toast.error(e);
        }
    }

    const registerTransaction = async () => {

        try {

            const result = await axios.post('/api/TransactionAPI', data);

            if (result.status !== 201) {

                toast.error(result.data.error);

            } else {

                toast.success(result.data.success);
                handleTransactions();
                setModalIsOpen(false);
                setData({ name: "", tag: "", description: "" });

            }

        } catch (e) {

            toast.error(e.response?.data?.error || "Erro ao criar transação");

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await registerTransaction();
    };

    const openEspecifictransaction = (id) => {

        router.push(`/transactions/${id}`);

    }

    return (
        <>
            <Head>
                <title>Transações</title>
                <meta name="transactions" content="Dashboard para gerenciar transações" />
            </Head>
            <CheckAuth>
                <div className={styles.container}>
                    <Sidebar></Sidebar>
                    <div className={styles.content}>
                        <div className={styles.center}>
                            <Autocomplete
                                className={styles.searchBar}
                                freeSolo
                                options={transactions}
                                inputValue={searchInput}
                                getOptionLabel={(option) => option.name || ''}
                                onInputChange={(e, value) => setSearchInput(value)}
                                onChange={(e, value) => openEspecifictransaction(value.id)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Pesquisar"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <div className={styles.button}>
                                <button className={styles.newButton} onClick={() => setModalIsOpen(true)}><i class="bi bi-plus"></i>Nova transação</button>
                            </div>
                            <div className={styles.page}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>TAG</th>
                                            <th>Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction.id} onClick={() => openEspecifictransaction(transaction.id)}>
                                                <td>{transaction.name}</td>
                                                <td>{transaction.tag}</td>
                                                <td>{transaction.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Cadastro de Nova Transação"
                        className={styles.modal}
                        overlayClassName={styles.overlay}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <h1>Cadastro de Transação</h1>
                            <div className={styles.transactionName}>
                                <input
                                    className={styles.input}
                                    required
                                    type="text"
                                    value={data.name}
                                    placeholder="Nome da transação"
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.tag}>
                                <input
                                    className={styles.input}
                                    required
                                    type="text"
                                    value={data.tag}
                                    placeholder="TAG"
                                    onChange={(e) => setData({ ...data, tag: e.target.value })}
                                />
                            </div>
                            <div className={styles.description}>
                                <textarea rows={5} cols={40}
                                    value={data.description}
                                    placeholder='Descrição'
                                    onChange={(e) => { setData({ ...data, description: e.target.value }) }}>
                                </textarea>
                            </div>
                            <button className={styles.registerBtn} type="submit">Cadastrar</button>
                            <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        </form>
                    </Modal>
                </div>
            </CheckAuth>
        </>
    );
}