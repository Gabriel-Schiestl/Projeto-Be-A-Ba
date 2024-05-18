import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewProfile() {
    const [data, setData] = useState({ profileName: "", modules: [], transactions: [], functions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setModalIsOpen(true)}>Novo Perfil</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Cadastro de Novo Perfil"
                className={styles.modal}
                overlayClassName={styles.overlay}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1>Cadastro de Perfil</h1>
                    <div className={styles.profileName}>
                        <input
                            type="text"
                            value={data.profileName}
                            placeholder="Nome do perfil"
                            onChange={(e) => setData({ ...data, profileName: e.target.value })}
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            className={styles.select}
                            isMulti
                            value={options.filter(option => data.modules.includes(option.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...data, modules: selectedValues });
                            }}
                            options={options}
                            placeholder='Módulos'
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            className={styles.select}
                            isMulti
                            value={options.filter(option => data.transactions.includes(option.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...data, transactions: selectedValues });
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
                                setData({ ...data, functions: selectedValues });
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