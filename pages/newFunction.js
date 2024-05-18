import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewFunction() {
    const [data, setData] = useState({ functionName: "", tag: "", description: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setModalIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setModalIsOpen(true)}>Nova Função</button>
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
                            onChange={(e) => { setData({ ...data, functionName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.tag}>
                        <input type="text"
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