import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

Modal.setAppElement('body');

export default function NewTransaction() {
    const [data, setData] = useState({ transactionName: "", tag: "", transactionDescription, functions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const handleInit = async (req, res) => {

        try {

            const transactions = await axios.get('/api/TransactionAPI');

            setTransactions(transactions);

        } catch (e) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);
    };

    return (
        <div className={styles.container}>
            {handleInit}
            <Sidebar></Sidebar>
            <div className={styles.content}>
                <div className={styles.center}>
                    <Autocomplete
                        className={styles.searchBar}
                        freeSolo
                        options={options}
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
                    <div className={styles.page}></div>
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
                            required
                            type="text"
                            value={data.transactionName}
                            placeholder="Nome da transação"
                            onChange={(e) => setData({ ...prevData, transactionName: e.target.value })}
                        />
                    </div>
                    <div className={styles.tag}>
                        <input
                            required
                            type="text"
                            value={data.tag}
                            placeholder="TAG"
                            onChange={(e) => setData({ ...prevData, tag: e.target.value })}
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            required
                            className={styles.select}
                            isMulti
                            value={options.filter(option => data.functions.includes(option.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...prevData, functions: selectedValues });
                            }}
                            options={options}
                            placeholder='Funções'
                        />
                    </div>
                    <button className={styles.registerBtn} type="submit">Cadastrar</button>
                    <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    );
}