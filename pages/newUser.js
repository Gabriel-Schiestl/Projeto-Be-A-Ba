import React, { use, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import validator from 'validator';
import Sidebar from 'components/Sidebar';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewUser() {

    const [data, setData] = useState({ userName: "", email: "", password: "", profiles: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);

        if (!validator.isEmail(data.email)) {
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
                            value={data.userName}
                            placeholder="Nome completo"
                            onChange={(e) => setData({ ...data, userName: e.target.value })}
                        />
                    </div>
                    <div className={styles.email}>
                        <input
                            type="text"
                            value={data.email}
                            placeholder="E-mail"
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.password}>
                        <input
                            type="text"
                            value={data.password}
                            placeholder="Senha"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            className={styles.select}
                            isMulti
                            value={options.filter(option => data.profiles.includes(option.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...data, profiles: selectedValues });
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