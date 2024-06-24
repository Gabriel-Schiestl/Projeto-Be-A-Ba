import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from '../styles/newUser.module.css';
import Sidebar from 'components/Sidebar';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import CheckAuth from "components/CheckAuth";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';

Modal.setAppElement('body');

export default function NewProfile() {

    const router = useRouter();
    const [data, setData] = useState({ name: "", functions: [], modulesTransactions: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [modulesFiltered, setModulesFiltered] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [transactionsFiltered, setTransactionsFiltered] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [modules, setModules] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {

        const handleInit = async () => {
            try {

                const [profilesRes, modulesRes, functionsRes, transactionsRes] = await Promise.all([
                    axios.get('/api/ProfileAPI'),
                    axios.get('/api/ModuleAPI'),
                    axios.get('/api/FunctionAPI'),
                    axios.get('/api/TransactionAPI'),
                ]);

                setProfiles(profilesRes.data);
                setModules(modulesRes.data);
                setTransactions(transactionsRes.data);

                const modulesOptions = modulesRes.data.map(module => ({
                    value: module.id,
                    label: module.name
                }));

                const functionsOptions = functionsRes.data.map(aFunction => ({
                    value: aFunction.id,
                    label: aFunction.name
                }));

                setModulesFiltered(modulesOptions);
                setFunctions(functionsOptions);

            } catch (e) {
                console.log(e)
            }
        };

        handleInit();
    }, []);

    const handleProfiles = async () => {

        try {

            const result = await axios.get('/api/ProfileAPI');

            if (result) {
                setProfiles(result.data)
                return;
            }

            toast.error(result.data.error);

        } catch (e) {
            toast.error(e);
        }
    }

    const registerProfile = async () => {

        try {

            const result = await axios.post('/api/ProfileAPI', data);

            if (result.status !== 201) {

                toast.error(result.data.error);

            } else {

                toast.success(result.data.success);
                setModulesFiltered(modules.map(module => ({
                    value: module.id,
                    label: module.name
                })));
                handleProfiles();
                setModalIsOpen(false);
                setData({ name: "", functions: [], modulesTransactions: [] });

            }

        } catch (e) {

            toast.error(e.response?.data?.error || "Erro ao criar perfil");

        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        await registerProfile();
    };

    const handleSelectedTransactions = () => {

        if (selectedModule && selectedTransactions.length > 0) {
            const moduleTransactions = {
                module: selectedModule,
                transactions: selectedTransactions,
            };

            if (data.modulesTransactions.some(mt => mt.module === selectedModule)) {
                toast.error("Módulo já adicionado.");
                return;
            }

            const updatedModulesTransactions = [...data.modulesTransactions, moduleTransactions];

            setData(prevData => ({
                ...prevData,
                modulesTransactions: updatedModulesTransactions
            }));
            setSelectedModule(null);
            setSelectedTransactions([]);
            setModulesFiltered(prevModulesFiltered => prevModulesFiltered.filter(module => module.value !== selectedModule));
        }
    };

    const openEspecificProfile = (id) => {

        router.push(`/profiles/${id}`);

    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
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
            height: '100%'
        }),
        placeholder: (provided) => ({
            ...provided,
            margin: '0px',
            fontSize: '1em',
            fontWeight: '525'
        }),
    };

    return (
        <>
            <Head>
                <title>Perfis</title>
                <meta name="profiles" content="Dashboard para gerenciar perfis" />
            </Head>
            <CheckAuth>
                <div className={styles.container}>
                    <Sidebar></Sidebar>
                    <div className={styles.content}>
                        <div className={styles.center}>
                            <Autocomplete
                                className={styles.searchBar}
                                freeSolo
                                options={profiles}
                                inputValue={searchInput}
                                getOptionLabel={(option) => option.name || ''}
                                onInputChange={(e, value) => setSearchInput(value)}
                                onChange={(e, value) => openEspecificProfile(value.id)}
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
                                <button className={styles.newButton}
                                    onClick={() => {
                                        setModalIsOpen(true);
                                        setData({ ...data, name: "" });
                                    }
                                    }><i class="bi bi-plus"></i>Novo perfil</button>
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
                                                <td>{format(new Date(profile.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</td>
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
                            <div className={styles.profileName} style={{ marginBottom: '3%' }}>
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
                            <div className={styles.profiles}>
                                <Select
                                    required
                                    className={styles.select}
                                    value={modules.find(option => option.value === selectedModule)}
                                    onChange={(selectedOption) => {
                                        setTransactionsFiltered([]);
                                        const moduleID = selectedOption.value;
                                        setSelectedModule(moduleID);
                                        const findModule = modules.find(module => module.id == moduleID);
                                        const findTransactions = findModule.transactions;
                                        const transactionsOptions = findTransactions.map(transaction => (
                                            { value: transaction.id, label: transaction.name }))
                                        setTransactionsFiltered(transactionsOptions);
                                    }}
                                    options={modulesFiltered}
                                    placeholder='Módulos'
                                />
                            </div>
                            <div className={styles.profiles}>
                                <Select
                                    className={styles.select}
                                    styles={{ menu: base => ({ ...base, maxHeight: '200px' }) }}
                                    isMulti
                                    value={transactionsFiltered.filter(option => selectedTransactions.includes(option.value))}
                                    onChange={(selectedOptions) => {
                                        const selectedValues = selectedOptions.map(option => option.value);
                                        setSelectedTransactions(selectedValues);
                                    }}
                                    options={transactionsFiltered}
                                    placeholder='Transações'
                                />
                            </div>

                            <button className={styles.registerBtn} type='button' onClick={handleSelectedTransactions}>Adicionar</button>
                            <button className={styles.registerBtn} type="submit">Cadastrar</button>
                            <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        </form>
                    </Modal>
                </div>
            </CheckAuth>
        </>
    );
}