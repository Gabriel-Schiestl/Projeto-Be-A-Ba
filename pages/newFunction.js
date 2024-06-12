import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckAuth from 'components/CheckAuth';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('body');

export default function NewFunction({ session }) {

    const router = useRouter();
    const [data, setData] = useState({ name: "", tag: "", description: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState("");
    const [functions, setFunctions] = useState([]);

    useEffect(() => {

        handleFunctions();

    }, []);

    const handleFunctions = async () => {

        const response = await axios.get('/api/FunctionAPI');

        if(response) setFunctions(response.data);

    }

    const registerFunction = async () => {

        try {

            const result = await axios.post('/api/FunctionAPI', data);

            if (result.status !== 201) {

                toast.error(result.data.error);

            } else {

                toast.success(result.data.success);
                handleFunctions();
                setModalIsOpen(false);
                setData({ name: "", tag: "", description: "" });

            }

        } catch (e) {

            toast.error(e.response?.data?.error || "Erro ao criar função");

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await registerFunction();
    };

    const openEspecificFuntion = (id) => {

        router.push(`/functions/${id}`);

    }

    return (
        <CheckAuth>
            <div className={styles.container}>
                <Sidebar></Sidebar>
                <div className={styles.content}>
                    <div className={styles.center}>
                        <Autocomplete
                            className={styles.searchBar}
                            freeSolo
                            options={functions}
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
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>TAG</th>
                                        <th>Descrição</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {functions.map(func => (
                                        <tr key={func.id} onClick={() => openEspecificFuntion(func.id)}>
                                            <td>{func.name}</td>
                                            <td>{func.tag}</td>
                                            <td>{func.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                className={styles.input}
                                required
                                type="text"
                                value={data.name}
                                placeholder='Nome da Função'
                                onChange={(e) => { setData({ ...data, name: e.target.value }) }}>
                            </input>
                        </div>
                        <div className={styles.tag}>
                            <input
                                className={styles.input}
                                type="text"
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
        </CheckAuth>
    );
}