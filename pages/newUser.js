import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import validator from 'validator';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewUser() {

    const [formData, setFormData] = useState({ userName: "", email: "", register, password: "", profile: "" });
    const [data, setData] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState("");

    useEffect(async (req, res) => {

        try {

            const response = await axios.get('/api/ProfileAPI.js');
            const data = response.data;

            setData(data);

        } catch (e) {

        }

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setModalIsOpen(false);

        if (!validator.isEmail(formData.email)) {
            setErrors("Email inválido");
        }
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
                        <button className={styles.newButton} onClick={() => setModalIsOpen(true)}><i class="bi bi-plus"></i>Novo usuário</button>
                    </div>
                    <div className={styles.page}></div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Cadastro de Novo Usuário"
                className={styles.modal}
                overlayClassName={styles.overlay}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1>Cadastro de usuário</h1>
                    <div className={styles.userName}>
                        <input
                            type="text"
                            value={formData.userName}
                            placeholder="Nome completo"
                            onChange={(e) => setFormData({ ...prevData, userName: e.target.value })}
                        />
                    </div>
                    <div className={styles.email}>
                        <input
                            type="text"
                            value={formData.email}
                            placeholder="E-mail"
                            onChange={(e) => setFormData({ ...prevData, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.password}>
                        <input
                            type="text"
                            value={data.password}
                            placeholder="Senha"
                            onChange={(e) => setFormData({ ...prevData, password: e.target.value })}
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            className={styles.select}
                            value={options.filter(option => data.profiles.includes(option.value))}
                            onChange={(selectedOption) => {
                                setFormData({ ...prevData, profile: selectedOption.value });
                            }}
                            options={options}
                            placeholder='Perfis'
                        />
                    </div>
                    <button className={styles.registerBtn} type="submit">Cadastrar</button>
                    <button className={styles.cancel} type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                    {errors && <div className={styles.error}>{errors}</div>}
                </form>
            </Modal>
        </div>
    );
}