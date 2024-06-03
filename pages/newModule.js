import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

Modal.setAppElement('body');

export default function NewModule() {

    const [data, setData] = useState({ name: "", tag: "", description: "", transactions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [errors, setErrors] = useState("");

    useEffect(() => {

        const getTransactions = async () => {

            try {

                const response = await axios.get('/api/TransactionAPI');

                if (response.status != 200) {

                    setErrors("Erro ao carregar transações");

                } else {

                    const transactionsOptions = response.data.map(transaction => ({
                        value: transaction.id,
                        label: transaction.name
                    }));

                    setTransactions(transactionsOptions);

                }

            } catch (e) {

                setErrors("Erro ao carregar transações");

            }
        }

        getTransactions();

    }, []);

    const registerModule = async () => {

        try {

            const result = await axios.post('/api/ModuleAPI', data);

            if (result.status !== 201) {

                setErrors(result.data.error);

            } else {

                setModalIsOpen(false);
                setData({ name: "", tag: "", description: "", transactions: [] });

            }

        } catch (e) {

            setErrors(e.response?.data?.error || "Erro ao criar módulo");

        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        await registerModule();
    };

    return (
        <div className={styles.container}>
            <Sidebar></Sidebar>
            <div className={styles.content}>
                <div className={styles.center}>
                    <Autocomplete
                        className={styles.searchBar}
                        freeSolo
                        options={transactions}
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
                        <button className={styles.newButton} onClick={() => setModalIsOpen(true)}><i class="bi bi-plus"></i>Novo módulo</button>
                    </div>
                    <div className={styles.page}></div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Cadastro de Novo Módulo"
                className={styles.modal}
                overlayClassName={styles.overlay}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1>Cadastro de Módulo</h1>
                    <div className={styles.moduleName}>
                        <input
                            required
                            type="text"
                            value={data.name}
                            placeholder="Nome do módulo"
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.tag}>
                        <input
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
                    <div className={styles.profiles}>
                        <Select
                            required
                            className={styles.select}
                            isMulti
                            value={transactions.filter(transaction => data.transactions.includes(transaction.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...data, transactions: selectedValues });
                            }}
                            options={transactions}
                            placeholder='Transações'
                        />
                    </div>
                    <button className={styles.registerBtn} type="submit">Cadastrar</button>
                    <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    );
}