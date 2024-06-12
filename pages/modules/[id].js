import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from 'styles/[id].module.css'
import Sidebar from "components/Sidebar";
import Modal from 'react-modal';
import Select from 'react-select';
import CheckAuth from "components/CheckAuth";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('body');

export default function User() {

    const router = useRouter();
    const { id } = router.query;
    const [module, setModule] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [data, setData] = useState({ name: "", tag: "", description: "", transactions: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        getModule();
        getTransactions();

    }, [id]);

    const getModule = async () => {

        if (!id) return;

        try {

            const result = await axios.get(`/api/ModuleAPI?id=${id}`);

            if (result.status == 200) {
                setModule(result.data);

                const transactionsId = result.data.transactions.map(transaction => transaction.id);

                setData({
                    name: result.data.name,
                    tag: result.data.tag,
                    description: result.data.description,
                    transactions: transactionsId
                })
            } else {
                toast.error(result.data.error);
            }
        } catch (e) {
            toast.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    const getTransactions = async () => {
        try {

            const result = await axios.get('/api/TransactionAPI');

            if (result.status == 200) {

                const transactions = result.data.map(transaction => ({ value: transaction.id, label: transaction.name }))
                setTransactions(transactions);

            } else {
                toast.error("Erro ao obter transações");
            }

        } catch (e) {
            toast.error(e);
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

        const transactionsAreEqual = arraysAreEqual(data.transactions, module.transactions);

        if (data.name != module.name || data.tag != module.tag
            || data.description != module.description || !transactionsAreEqual) {

            try {

                const result = await axios.put(`/api/ModuleAPI?id=${id}`, data);

                if (result.status != 200) {

                    toast.error(result.data.error);
                    return;

                }

                toast.success("Sucesso ao editar módulo");
                getModule();
                setOpen(false);

            } catch (e) {
                toast.error(e);
            }
        } else {
            setOpen(false);
        }
    }

    const deleteModule = async () => {

        try {

            const result = await axios.delete(`/api/ModuleAPI?id=${id}`);

            if (result.status != 200) {
                toast.error(result.data.error);
                return;
            }

            toast.success("Módulo excluído");
            setDeleteOpen(false);
            router.push('/newModule');

        } catch (e) {
            toast.error(e);
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
                        <div className={styles.modulePage}>
                            <div style={{width: '60%'}}>
                                <table className={styles.table}>
                                    <td>
                                        <tr><h2>Nome do módulo:</h2><p>{module.name}</p></tr>
                                        <tr><h2>TAG:</h2><p>{module.tag}</p></tr>
                                        <tr><h2>Descrição:</h2><p>{module.description}</p></tr>
                                        <tr><h2>Data de criação:</h2><p>{module.createdAt}</p></tr>
                                    </td>
                                </table>
                            </div>
                            <div style={{width: '35%'}}>
                                <table>
                                    <thead>
                                        <tr><h2>Transações:</h2></tr>
                                    </thead>
                                    <tbody>
                                        {module.transactions.map(transaction => (
                                            <tr key={transaction.id}>{transaction.name}</tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.moduleBtns}>
                            <button className={styles.deleteBtn} onClick={() => setDeleteOpen(true)}>Excluir</button>
                            <button className={styles.editBtn} onClick={() => setOpen(true)}>Editar</button>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={deleteOpen}
                    onRequestClose={() => setDeleteOpen(false)}
                    contentLabel="Excluir módulo?"
                    className={styles.deleteModal}
                    overlayClassName={styles.overlay}>
                    <div className={styles.modalContent}>
                        <h2>Tem certeza que deseja excluir este módulo?</h2>
                        <p>Esta ação excluirá o módulo permanentemente!</p>
                        <div className={styles.buttonsDiv}>
                            <button type="button" onClick={() => setDeleteOpen(false)}>Cancelar</button>
                            <button className={styles.confirmBtn} type="button" onClick={deleteModule}>Excluir</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setOpen(false)}
                    contentLabel="Edição de Módulo"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleEdit}>
                        <h1>Edição de Módulo</h1>
                        <div className={styles.moduleName}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.name}
                                placeholder="Nome do módulo"
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.tag}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.tag}
                                placeholder="TAG"
                                onChange={(e) => setData({ ...data, tag: e.target.value })}
                            />
                        </div>
                        <div className={styles.description}>
                            <textarea rows={5} cols={40}
                                value={data.description}
                                placeholder='Descrição'
                                onChange={(e) => { setData({ ...data, description: e.target.value }) }}>
                            </textarea>
                        </div>
                        <div className={styles.profiles}>
                            <Select
                                required
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
                        <button
                            style={{ marginTop: '5%' }}
                            className={styles.registerBtn}
                            type="submit">
                            Salvar</button>
                        <button className={styles.cancelBtn} type="button" onClick={() => setOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    )
}