import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckAuth from 'components/CheckAuth';
import axios from 'axios';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewFunction({ session }) {

    const [data, setData] = useState({ name: "", tag: "", description: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState("");

    const registerFunction = async () => {

        try {

            const result = await axios.post('/api/FunctionAPI', data);

            if (result.status !== 201) {

                setErrors(result.data.error);

            } else {

                setModalIsOpen(false);
                setData({ name: "", tag: "", description: "" });
                
            }

        } catch (e) {

            setErrors(e.response?.data?.error || "Erro ao criar função");

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await registerFunction();
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
                            <input
                                required
                                type="text"
                                value={data.name}
                                placeholder='Nome da Função'
                                onChange={(e) => { setData({ ...data, name: e.target.value }) }}>
                            </input>
                        </div>
                        <div className={styles.tag}>
                            <input type="text"
                                required
                                value={data.tag}
                                placeholder='TAG'
                                onChange={(e) => { setData({ ...data, tag: e.target.value }) }}>
                            </input>
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
    );
}