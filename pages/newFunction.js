import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckAuth from 'components/CheckAuth';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewFunction({ session }) {
    const [data, setData] = useState({ functionName: "", tag: "", functionDescription: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);
    };

    return (
        <CheckAuth>
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
                            <button className={styles.newButton} onClick={() => setModalIsOpen(true)}><i class="bi bi-plus"></i>Nova função</button>
                        </div>
                        <div className={styles.page}>
                            <div className={styles.pageHeader}>
                                <ul>
                                    <li>Nome</li>
                                    <li>Descrição</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Cadastro de Nova Função"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1>Cadastro de Função</h1>
                        <div className={styles.functionName}>
                            <input type="text"
                                value={data.functionName}
                                placeholder='Nome da Função'
                                onChange={(e) => { setData({ ...prevData, functionName: e.target.value }) }}>
                            </input>
                        </div>
                        <div className={styles.tag}>
                            <input type="text"
                                value={data.tag}
                                placeholder='TAG'
                                onChange={(e) => { setData({ ...prevData, tag: e.target.value }) }}>
                            </input>
                        </div>
                        <div className={styles.description}>
                            <textarea rows={5} cols={40}
                                value={data.functionDescription}
                                placeholder='Descrição'
                                onChange={(e) => { setData({ ...prevData, functionDescription: e.target.value }) }}>
                            </textarea>
                        </div>
                        <button className={styles.registerBtn} type="submit">Cadastrar</button>
                        <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    );
}