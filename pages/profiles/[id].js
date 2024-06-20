import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import styles from 'styles/[id].module.css'
import Sidebar from 'components/Sidebar';
import axios from 'axios';
import CheckAuth from "components/CheckAuth";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const options = [
    { value: 'Caixa VC', label: 'Caixa VC' },
    { value: 'Estabelecimento', label: 'Estabelecimento' },
];

Modal.setAppElement('body');

export default function NewProfile() {

    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState({ name: "", functions: [], modules: [] });
    const [newData, setNewData] = useState({ name: "", functions: [], modulesTransactions: [] });
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [modulesFiltered, setModulesFiltered] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [transactionsFiltered, setTransactionsFiltered] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [modules, setModules] = useState([]);

    useEffect(() => {

        const handleInit = async () => {
            try {
                const [modulesRes, functionsRes, transactionsRes] = await Promise.all([
                    axios.get('/api/ModuleAPI'),
                    axios.get('/api/FunctionAPI'),
                    axios.get('/api/TransactionAPI'),
                ]);

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
                toast.error("Erro ao carregar dados iniciais");
            }
        };

        handleInit();
        getProfile();
    }, [id]);

    const getProfile = async () => {

        if (!id) return;
        setIsLoading(true);
        try {

            const result = await axios.get(`/api/ProfileAPI?id=${id}`);

            if (result.status == 200) {
                setProfile(result.data);
                const profileModules = result.data.modules.map(module => module.id);
                const profileFunctions = result.data.functions.map(aFunction => aFunction.id);
                console.log(result.data.createdAt)
                setData({ name: result.data.name, modules: profileModules, functions: profileFunctions });
            } else {
                toast.error("Erro ao obter perfil");
            }
        } catch (e) {
            toast.error(e);
        }

        setIsLoading(false);
    }

    const editProfile = async () => {

        const functionsIds = data.functions.map(f => f.value || f);

        const requestBody = {
            name: data.name,
            functions: functionsIds,
            modulesTransactions: newData.modulesTransactions
        };

        let result;
        try {
            result = await axios.put(`/api/ProfileAPI?id=${id}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (result.status !== 200) {
                toast.error(result.data.error);
                return;
            }

        } catch (e) {
            toast.error("Erro ao atualizar perfil");
        }

        toast.success(result.data.success);
        setModulesFiltered(modules.map(module => ({
            value: module.id,
            label: module.name
        })));
        setNewData({ name: "", functions: [], modulesTransactions: [] });
        getProfile();
        setOpen(false);
    }

    const handleEdit = async (e) => {

        e.preventDefault();

        await editProfile();
    };

    const handleSelected = () => {

        if (selectedModule && selectedTransactions.length > 0) {
            const moduleTransactions = {
                module: selectedModule,
                transactions: selectedTransactions,
            };

            if (newData.modulesTransactions.some(mt => mt.module === selectedModule)) {
                toast.error("Módulo já editado");
                return;
            }

            const updatedModulesTransactions = [...newData.modulesTransactions, moduleTransactions];

            setNewData(prevData => ({
                ...prevData,
                modulesTransactions: updatedModulesTransactions
            }));
            setSelectedModule(null);
            setSelectedTransactions([]);
            setModulesFiltered(prevModulesFiltered => prevModulesFiltered.filter(module => module.value !== selectedModule));
        }
    };

    const deleteUser = async () => {

        try {

            const result = await axios.delete(`/api/ProfileAPI?id=${id}`);

            if (result.status != 200) {
                toast.error(result.data.error);
                return;
            }

            toast.success("Perfil excluído");
            setDeleteOpen(false);
            router.push('/newProfile');

        } catch (e) {
            toast.error(e);
        }
    }

    const handleBack = () => {
        router.back();
    }

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <CheckAuth>
            <div className={styles.container}>
                <Sidebar></Sidebar>
                <div className={styles.content}>
                    <div className={styles.center}>
                        <i class="bi bi-arrow-left" onClick={handleBack}></i>
                        <div className={styles.profilePage}>
                            {profile && profile.createdAt &&
                                <table className={styles.table}>
                                    <td>
                                        <tr><h2>Nome do perfil:</h2><p>{profile.name}</p></tr>
                                        <tr><h2>Data de criação:</h2><p>{format(new Date(profile.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</p></tr>
                                    </td>
                                </table>
                            }
                        </div>
                        <div className={styles.subpages}>
                            <div>
                                {profile && profile.modules &&
                                    <table>
                                        <thead>
                                            <tr><h2>Módulos:</h2></tr>
                                        </thead>
                                        <tbody>
                                            {profile.modules.map(module => (
                                                <tr key={module.id}>{module.name}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                            <div>
                                {profile && profile.functions &&
                                    <table>
                                        <thead>
                                            <tr><h2>Funções:</h2></tr>
                                        </thead>
                                        <tbody>
                                            {profile.functions.map(aFunction => (
                                                <tr key={aFunction.id}>{aFunction.name}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                        <div className={styles.btns}>
                            <button className={styles.deleteBtn} onClick={() => setDeleteOpen(true)}>Excluir</button>
                            <button className={styles.editBtn} onClick={() => setOpen(true)}>Editar</button>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={deleteOpen}
                    onRequestClose={() => setDeleteOpen(false)}
                    contentLabel="Excluir perfil?"
                    className={styles.deleteModal}
                    overlayClassName={styles.overlay}>
                    <div className={styles.modalContent}>
                        <h2>Tem certeza que deseja excluir este perfil?</h2>
                        <p>Esta ação excluirá o perfil permanentemente!</p>
                        <div className={styles.buttonsDiv}>
                            <button type="button" onClick={() => setDeleteOpen(false)}>Cancelar</button>
                            <button className={styles.confirmBtn} type="button" onClick={deleteUser}>Excluir</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setOpen(false)}
                    contentLabel="Edição de Perfil"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleEdit}>
                        <h1>Edição de Perfil</h1>
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
                                styles={{ menu: base => ({ ...base, maxHeight: '200px' }) }}
                                isMulti
                                value={functions.filter(aFunction => data.functions.includes(aFunction.value))}
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
                                styles={{ menu: base => ({ ...base, maxHeight: '220px', overflowY: 'scroll' }) }}
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
                                isMulti
                                styles={{ menu: base => ({ ...base, maxHeight: '200px' }) }}
                                value={transactionsFiltered.filter(option => selectedTransactions.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    setSelectedTransactions(selectedValues);
                                }}
                                options={transactionsFiltered}
                                placeholder='Transações'
                            />
                        </div>
                        <button className={styles.registerBtn} type='button' onClick={handleSelected}>Adicionar</button>
                        <button className={styles.registerBtn} type="submit">Salvar</button>
                        <button type="button" onClick={() => setOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    );
}