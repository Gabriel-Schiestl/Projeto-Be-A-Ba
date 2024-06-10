import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from 'styles/[id].module.css'
import Sidebar from "components/Sidebar";
import Modal from 'react-modal';
import Select from 'react-select';

Modal.setAppElement('body');

export default function User() {

    const router = useRouter();
    const { id } = router.query;
    const [profile, setProfile] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [data, setData] = useState({ name: "", modules: [], transactions: [], functions: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [functions, setFunctions] = useState([]);

    useEffect(() => {

        getProfile();
        getData();

    }, [id]);

    const getProfile = async () => {

        if (!id) return;

        try {

            const result = await axios.get(`/api/ProfileAPI?id=${id}`);

            if (result) {
                setProfile(result.data);
                const profileModules = result.data.modules.map(module => module.id);
                const profileTransactions = result.data.transactions.map(transaction => transaction.id);
                const profileFunctions = result.data.functions.map(aFunction => aFunction.id);

                setData({ name: result.data.name, modules: profileModules, functions: profileFunctions, transactions: profileTransactions });
            }

        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const getData = async () => {
        try {

            const [modulesResponse, functionsResponse, transactionsResponse] = await Promise.all([
                axios.get('/api/ModuleAPI'),
                axios.get('/api/FunctionAPI'),
                axios.get('/api/TransactionAPI'),
            ])

            const modules = modulesResponse.data.map(module => ({ value: module.id, label: module.name }));
            const functions = functionsResponse.data.map(aFunction => ({ value: aFunction.id, label: aFunction.name }));
            const transactions = transactionsResponse.data.map(transaction => ({ value: transaction.id, label: transaction.name }));

            setModules(modules);
            setTransactions(transactions);
            setFunctions(functions);

        } catch (e) {
            console.log(e);
        }
    };

    const handleBack = () => {
        router.back();
    }

    const arraysAreEqual = (array1, array2) => {
        if (array1.length !== array2.length) return false;
        const sortedArray1 = [...array1].sort();
        const sortedArray2 = [...array2].sort();
        return sortedArray1.every((value, index) => value === sortedArray2[index]);
    };

    const handleEdit = async (e) => {

        e.preventDefault();

        const idModules = profile.modules.map(module => module.id);
        const idTransactions = profile.transactions.map(transaction => transaction.id);
        const idFunctions = profile.functions.map(aFunction => aFunction.id);

        const modulesAreEqual = arraysAreEqual(data.modules, idModules);
        const transactionsAreEqual = arraysAreEqual(data.transactions, idTransactions);
        const functionsAreEqual = arraysAreEqual(data.functions, idFunctions);

        if (data.name != profile.name || !modulesAreEqual
            || !transactionsAreEqual || !functionsAreEqual) {

            try {

                const result = await axios.put(`/api/ProfileAPI?id=${id}`, data);

                if (result.status != 200) {

                    console.log(result.statusText);
                    return;

                }

                getProfile();
                setOpen(false);
                console.log("Sucesso ao editar perfil");

            } catch (e) {
                console.log(e);
            }
        } else {
            setOpen(false);
        }
    }

    const deleteUser = async () => {

        try {

            const result = await axios.delete(`/api/ProfileAPI?id=${id}`);

            if (result.status != 200) {
                console.log(result.statusText);
                return;
            }

            setDeleteOpen(false);
            console.log("Sucesso ao deletar perfil");
            router.push('/newProfile');

        } catch (e) {
            console.log(e);
        }

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
            height: 'auto',
            padding: '0 3%',
            display: 'flex',
            flexWrap: 'wrap'
        }),
        multiValue: (provided) => ({
            ...provided,
            margin: '2px'
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

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <Sidebar></Sidebar>
            <div className={styles.content}>
                <div className={styles.center}>
                    <i class="bi bi-arrow-left" onClick={handleBack}></i>
                    <div className={styles.profilePage}>
                        <table className={styles.table}>
                            <td>
                                <tr><h2>Nome do perfil:</h2><p>{profile.name}</p></tr>
                                <tr><h2>Data de criação:</h2><p>{profile.createdAt}</p></tr>
                            </td>
                        </table>
                    </div>
                    <div className={styles.subpages}>
                        <div>
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
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr><h2>Transações:</h2></tr>
                                </thead>
                                <tbody>
                                    {profile.transactions.map(transaction => (
                                        <tr key={transaction.id}>{transaction.name}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
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
                            required
                            className={styles.select}
                            isMulti
                            styles={customStyles}
                            value={modules.filter(module => data.modules.includes(module.value))}
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
                            styles={customStyles}
                            value={transactions.filter(transaction => data.transactions.includes(transaction.value))}
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
                            styles={customStyles}
                            value={functions.filter(aFunction => data.functions.includes(aFunction.value))}
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                setData({ ...data, functions: selectedValues });
                            }}
                            options={functions}
                            placeholder='Funções'
                        />
                    </div>
                    <button className={styles.registerBtn} type="submit">Salvar</button>
                    <button type="button" onClick={() => setOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    )
}