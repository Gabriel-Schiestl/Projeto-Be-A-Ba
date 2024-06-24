import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from 'styles/[id].module.css'
import Sidebar from "components/Sidebar";
import Modal from 'react-modal';
import CheckAuth from "components/CheckAuth";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from "next/head";

Modal.setAppElement('body');

export default function aFunction() {

    const router = useRouter();
    const { id } = router.query;
    const [aFunction, setAFunction] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [data, setData] = useState({ name: "", tag: "", description: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getFunction();

    }, [id]);

    const getFunction = async () => {

        if (!id) return;

        try {

            const result = await axios.get(`/api/FunctionAPI?id=${id}`);

            if (result.status == 200) {
                setAFunction(result.data);
                return;
            }

            toast.error(result.data.error);

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

        if (data.name != aFunction.name || data.tag != aFunction.tag || data.description != aFunction.description) {

            try {

                const result = await axios.put(`/api/FunctionAPI?id=${id}`, data);

                if (result.status != 200) {

                    toast.error(result.data.error);
                    return;
                }

                toast.success("Função atualizada");
                getFunction();
                setOpen(false);

            } catch (e) {
                toast.error(e);
            }
        }
    }

    const deleteFunction = async () => {

        try {

            const result = await axios.delete(`/api/FunctionAPI?id=${id}`);

            if (result.status != 200) {
                toast.error(result.data.error);
                return;
            }

            toast.success("Função excluída");
            setDeleteOpen(false);
            router.push('/newFunction');

        } catch (e) {
            toast.error(e);
        }

    }

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <Head>
                <title>{aFunction.name}</title>
                <meta name="function" content="Dashboard para gerenciar função" />
            </Head>
            <CheckAuth>
                <div className={styles.container}>
                    <Sidebar></Sidebar>
                    <div className={styles.content}>
                        <div className={styles.center}>
                            <i class="bi bi-arrow-left" onClick={handleBack}></i>
                            <div className={styles.page}>
                                <table className={styles.table}>
                                    <td>
                                        <tr><h2>Nome da função:</h2><p>{aFunction.name}</p></tr>
                                        <tr><h2>TAG da função:</h2><p>{aFunction.tag}</p></tr>
                                        <tr><h2>Descrição da função:</h2><p>{aFunction.description}</p></tr>
                                        <tr><h2>Data de criação:</h2><p>{format(new Date(aFunction.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</p></tr>
                                    </td>
                                </table>
                            </div>
                            <div className={styles.btns}>
                                <button className={styles.deleteBtn} onClick={() => setDeleteOpen(true)}>Excluir</button>
                                <button className={styles.editBtn} onClick={() => {
                                    setOpen(true)
                                    setData({ name: aFunction.name, tag: aFunction.tag, description: aFunction.description });
                                }}>Editar</button>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={deleteOpen}
                        onRequestClose={() => setDeleteOpen(false)}
                        contentLabel="Excluir função?"
                        className={styles.deleteModal}
                        overlayClassName={styles.overlay}>
                        <div className={styles.modalContent}>
                            <h2>Tem certeza que deseja excluir esta função?</h2>
                            <p>Esta ação excluirá a função permanentemente!</p>
                            <div className={styles.buttonsDiv}>
                                <button type="button" onClick={() => setDeleteOpen(false)}>Cancelar</button>
                                <button className={styles.confirmBtn} type="button" onClick={deleteFunction}>Excluir</button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setOpen(false)}
                        contentLabel="Edição de Função"
                        className={styles.modal}
                        overlayClassName={styles.overlay}>
                        <form className={styles.form} onSubmit={handleEdit}>
                            <h1>Edição de Função</h1>
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
                            <button className={styles.registerBtn} onClick={handleEdit}>Salvar</button>
                            <button className={styles.cancel} onClick={() => setOpen(false)}>Cancelar</button>
                        </form>
                    </Modal>
                </div>
            </CheckAuth>
        </>
    )
}