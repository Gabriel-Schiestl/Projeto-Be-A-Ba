import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from 'styles/[id].module.css'
import Sidebar from "components/Sidebar";
import Modal from 'react-modal';

export default function User() {

    const router = useRouter();
    const { id } = router.query;
    const [aFunction, setFunction] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [data, setData] = useState({ name: "", tag: "", description: "" });

    useEffect(() => {

        const getFunction = async () => {

            try {

                const result = await axios.get(`/api/FunctionAPI?id=${id}`);

                if (result) {
                    setFunction(result.data);
                }

            } catch (e) {
                console.log(e);
            }

        }

        getFunction();

    }, [id]);

    const handleBack = () => {
        router.back();
    }

    const handleEdit = () => {



    }

    return (
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
                                <tr><h2>Data de criação:</h2><p>{aFunction.createdAt}</p></tr>
                            </td>
                        </table>
                    </div>
                    <div className={styles.btns}>
                        <button>Excluir</button>
                        <button onClick={() => {
                            setOpen(true)
                            setData({ name: aFunction.name, tag: aFunction.tag, description: aFunction.description });
                        }}>Editar</button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setOpen(false)}
                contentLabel="Edicao de Função"
                className={styles.modal}
                overlayClassName={styles.overlay}>
                <form className={styles.form} onSubmit={handleEdit}>
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
                    <button className={styles.registerBtn} type="submit">Salvar</button>
                    <button type="button" onClick={() => setOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    )
}