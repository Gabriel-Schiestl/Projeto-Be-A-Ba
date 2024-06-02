import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewProfile() {

    const [data, setData] = useState({ profileName: "", modules: [], transactions: [], functions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [modules, setModules] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [errors, setErrors] = useState("");

    useEffect(() => {

        const handleInit = async () => {

            try {

                const [profileRes, moduleRes, transactionRes, functionRes] = await Promise.all([
                    axios.get('/api/ProfileAPI'),
                    axios.get('/api/ModuleAPI'),
                    axios.get('/api/TransactionAPI'),
                    axios.get('/api/FunctionAPI')
                ]);

                setProfiles(profileRes.data);
                setModules(moduleRes.data);
                setTransactions(transactionRes.data);
                setFunctions(functionRes.data);

            } catch (e) {

                setErrors("Erro ao carregar dados iniciais");

            }
        };

        handleInit();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors("");

        try {

            const result = await axios.post('/api/ProfileAPI', data);

            if (result.status !== 201) {

                setErrors(result.data.error);

            }

            setModalIsOpen(false);

        } catch (e) {

            setErrors(e.response?.data?.error || "Erro ao criar perfil");

        }
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
                        <button className={styles.newButton} onClick={() => setModalIsOpen(true)}><i class="bi bi-plus"></i>Novo perfil</button>
                    </div>
                    <div className={styles.page}></div>
                </div>
            </div>
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
                            required
                            type="text"
                            value={data.profileName}
                            placeholder="Nome do perfil"
                            onChange={(e) => setData({ ...data, profileName: e.target.value })}
                        />
                    </div>
                    <div className={styles.profiles}>
                        <Select
                            required
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