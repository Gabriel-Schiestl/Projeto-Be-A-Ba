import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import CheckAuth from "components/CheckAuth";
import { useRouter } from 'next/router';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewProfile() {

    const router = useRouter();
    const [data, setData] = useState({ name: "", modules: [], transactions: [], functions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [modules, setModules] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [errors, setErrors] = useState("");

    useEffect(() => {

        const handleInit = async () => {

            try {

                const [profiles, modules, transactions, functions] = await Promise.all([
                    axios.get('/api/ProfileAPI'),
                    axios.get('/api/ModuleAPI'),
                    axios.get('/api/TransactionAPI'),
                    axios.get('/api/FunctionAPI')
                ]);

                setProfiles(profiles.data);

                const modulesOptions = modules.data.map(module => ({
                    value: module.id,
                    label: module.name
                }));

                const transactionsOptions = transactions.data.map(transaction => ({
                    value: transaction.id,
                    label: transaction.name
                }));

                const functionsOptions = functions.data.map(aFunction => ({
                    value: aFunction.id,
                    label: aFunction.name
                }));

                setModules(modulesOptions);
                setTransactions(transactionsOptions);
                setFunctions(functionsOptions);

            } catch (e) {

                setErrors("Erro ao carregar dados iniciais");

            }
        };

        handleInit();

    }, []);

    const registerProfile = async () => {

        try {

            const result = await axios.post('/api/ProfileAPI', data);

            if (result.status !== 201) {

                setErrors(result.data.error);

            } else {

                setModalIsOpen(false);
                setData({ name: "", modules: [], transactions: [], functions: [] });

            }

        } catch (e) {

            setErrors(e.response?.data?.error || "Erro ao criar perfil");

        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        await registerProfile();
    };

    const openEspecificProfile = (id) => {

        router.push(`/profiles/${id}`);

    }

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
                        <div className={styles.page}>
                        <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Data de criação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map(profile => (
                                        <tr key={profile.id} onClick={() => openEspecificProfile(profile.id)}>
                                            <td>{profile.name}</td>
                                            <td>{profile.createdAt}</td>
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
                    contentLabel="Cadastro de Novo Perfil"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h1>Cadastro de Perfil</h1>
                        <div className={styles.profileName} style={{marginBottom: '3%'}}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.name}
                                placeholder="Nome do perfil"
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.profiles}>
                            <Select
                                required
                                className={styles.select}
                                isMulti
                                value={modules.filter(option => data.modules.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    setData({ ...data, modules: selectedValues });
                                }}
                                options={modules}
                                placeholder='Módulos'
                            />
                        </div>
                        <div className={styles.profiles}>
                            <Select
                                className={styles.select}
                                isMulti
                                value={transactions.filter(option => data.transactions.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    setData({ ...data, transactions: selectedValues });
                                }}
                                options={transactions}
                                placeholder='Transações'
                            />
                        </div>
                        <div className={styles.profiles}>
                            <Select
                                className={styles.select}
                                isMulti
                                value={functions.filter(option => data.functions.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    setData({ ...data, functions: selectedValues });
                                }}
                                options={functions}
                                placeholder='Funções'
                            />
                        </div>
                        <button className={styles.registerBtn} type="submit">Cadastrar</button>
                        <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    );
}