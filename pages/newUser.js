import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import validator from 'validator';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import CheckAuth from "components/CheckAuth";

Modal.setAppElement('body');

export default function NewUser() {

    const [formData, setFormData] = useState({ name: "", email: "", register: "", password: "", profile: [] });
    const [data, setData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState("");
    const [profiles, setProfiles] = useState([]);


    useEffect(() => {

        const handleInit = async () => {

            try {

                const users = await axios.get('/api/UserAPI');

                setData(users.data);

                const profiles = await axios.get('/api/ProfileAPI');

                const profilesOptions = profiles.data.map(profile => ({
                    value: profile.id,
                    label: profile.name
                }));

                setProfiles(profilesOptions);

            } catch (e) {

                setErrors(e.message);

            }
        }

        handleInit();

    }, []);

    const registerUser = async (req, res) => {


        if (!validator.isEmail(formData.email)) {

            setErrors("Email inválido");

        } else {

            try {

                const result = await axios.post('/api/UserAPI', formData);

                if (result.status !== 201) {

                    setErrors(result.data.error);

                } else {

                    setModalIsOpen(false);
                    setFormData({ name: "", email: "", register: "", password: "", profile: [] });

                }

            } catch (e) {

                setErrors(e.response?.data?.error || "Erro ao criar usuário");

            }
        }

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        await registerUser();
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            marginTop: '4%',
            minHeight: '100%',
            boxShadow: 'none',
            border: '1px solid'
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '100%',
            padding: '0 3%',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            height: '100%',
        }),
        placeholder: (provided) => ({
            ...provided,
            margin: '0px',
            fontSize: '1em',
            fontWeight: '525'
        }),
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
                            options={profiles}
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
                                className={styles.input}
                                required
                                type="text"
                                value={formData.name}
                                placeholder="Nome completo"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.email}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={formData.email}
                                placeholder="E-mail"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className={styles.email}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={formData.register}
                                placeholder="Matrícula"
                                onChange={(e) => setFormData({ ...formData, register: e.target.value })}
                            />
                        </div>
                        <div className={styles.password}>
                            <input
                                className={styles.input}
                                required
                                type="password"
                                value={data.password}
                                placeholder="Senha"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className={styles.profiles}>
                            <Select
                                required
                                styles={customStyles}
                                className={styles.select}
                                value={profiles.filter(option => formData.profile.includes(option.value))}
                                onChange={(selectedOption) => {
                                    setFormData({ ...formData, profile: [selectedOption.value] });
                                }}
                                options={profiles}
                                placeholder='Perfis'
                            />
                        </div>
                        <button
                        style={{marginTop: '5%'}}
                            className={styles.registerBtn}
                            type="submit">
                            Cadastrar</button>
                        <button className={styles.cancel} type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        {errors && <div className={styles.error}>{errors}</div>}
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    );
}