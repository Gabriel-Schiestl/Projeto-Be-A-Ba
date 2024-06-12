import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from 'styles/[id].module.css'
import Sidebar from "components/Sidebar";
import Modal from 'react-modal';
import CheckAuth from "components/CheckAuth";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('body');

export default function Transaction() {

    const router = useRouter();
    const { id } = router.query;
    const [transaction, setTransaction] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [data, setData] = useState({ name: "", tag: "", description: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getTransaction();

    }, [id]);

    const getTransaction = async () => {

        if (!id) return;

        try {

            const result = await axios.get(`/api/TransactionAPI?id=${id}`);

            if (result.status == 200) {
                setTransaction(result.data);
            } else {
                toast.error(result.data.error);
            }

        } catch (e) {
            toast.error(e);
        } finally {
            setIsLoading(false);
        }

    }

    const handleBack = () => {
        router.back();
    }

    const handleEdit = async (e) => {

        e.preventDefault();

        if (data.name != transaction.name || data.tag != transaction.tag || data.description != transaction.description) {

            try {

                const result = await axios.put(`/api/TransactionAPI?id=${id}`, data);

                if (result.status != 200) {

                    toast.error(result.statusText);
                    return;

                }

                toast.success("Sucesso ao editar transação");
                getTransaction();
                setOpen(false);

            } catch (e) {
                toast.error(e);
            }
        }
    }

    const deleteTransaction = async () => {

        try {

            const result = await axios.delete(`/api/TransactionAPI?id=${id}`);

            if (result.status != 200) {
                toast.error(result.statusText);
                return;
            }

            setDeleteOpen(false);
            toast.success("Transação excluída");
            router.push('/newTransaction');

        } catch (e) {
            toast.error(e);
        }

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
                        <div className={styles.page}>
                            <table className={styles.table}>
                                <td>
                                    <tr><h2>Nome da transação:</h2><p>{transaction.name}</p></tr>
                                    <tr><h2>TAG da transação:</h2><p>{transaction.tag}</p></tr>
                                    <tr><h2>Descrição da transação:</h2><p>{transaction.description}</p></tr>
                                    <tr><h2>Data de criação:</h2><p>{transaction.createdAt}</p></tr>
                                </td>
                            </table>
                        </div>
                        <div className={styles.btns}>
                            <button className={styles.deleteBtn} onClick={() => setDeleteOpen(true)}>Excluir</button>
                            <button className={styles.editBtn} onClick={() => {
                                setOpen(true)
                                setData({ name: transaction.name, tag: transaction.tag, description: transaction.description });
                            }}>Editar</button>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={deleteOpen}
                    onRequestClose={() => setDeleteOpen(false)}
                    contentLabel="Excluir transação?"
                    className={styles.deleteModal}
                    overlayClassName={styles.overlay}>
                    <div className={styles.modalContent}>
                        <h2>Tem certeza que deseja excluir esta transação?</h2>
                        <p>Esta ação excluirá a transação permanentemente!</p>
                        <div className={styles.buttonsDiv}>
                            <button type="button" onClick={() => setDeleteOpen(false)}>Cancelar</button>
                            <button className={styles.confirmBtn} type="button" onClick={deleteTransaction}>Excluir</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setOpen(false)}
                    contentLabel="Edição de transação"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleEdit}>
                        <h1>Edição de transação</h1>
                        <div className={styles.functionName}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.name}
                                placeholder='Nome da transação'
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
                        <button className={styles.registerBtn} onClick={handleEdit}>Salvar</button>
                        <button className={styles.cancel} onClick={() => setOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    )
}