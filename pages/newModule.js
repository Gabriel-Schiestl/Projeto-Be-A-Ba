import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewModule() {

    const [data, setData] = useState({ moduleName: "", tag: "", moduleDescription, transactions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(async () => {

        const response = axios.get('/api/ModuleAPI');
        console.log(response)

    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);
    };

    return (
        <div className={styles.container}>
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
                            value={data.moduleName}
                            placeholder="Nome do módulo"
                            onChange={(e) => setData({ ...data, moduleName: e.target.value })}
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
                    <div className={styles.profiles}>
                        <Select
                            required
                            className={styles.select}
                            isMulti
                            value={options.filter(option => data.transactions.includes(option.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...prevData, transactions: selectedValues });
                            }}
                            options={options}
                            placeholder='Transações'
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
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