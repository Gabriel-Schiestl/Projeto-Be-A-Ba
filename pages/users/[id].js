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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

Modal.setAppElement('body');

export default function User() {

    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [data, setData] = useState({ name: "", email: "", register: "", password: "", profile: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {

        getUser();
        getProfiles();

    }, [id]);

    const getUser = async () => {

        if (!id) return;

        try {

            const result = await axios.get(`/api/UserAPI?id=${id}`);

            if (result.status == 200) {
                setUser(result.data);
                setData({
                    name: result.data.name,
                    email: result.data.email,
                    register: result.data.register,
                    profile: result.data.profileId
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

    const getProfiles = async () => {
        try {

            const result = await axios.get('/api/ProfileAPI');

            if (result.status == 200) {

                const profiles = result.data.map(profile => ({ value: profile.id, label: profile.name }))
                setProfiles(profiles);

            } else {
                toast.error(result.data.error);
            }
        } catch (e) {
            toast.error(e);
        }
    };

    useEffect(() => {
        setData({ ...data, profile: user.profileId });
    }, [user]);

    const handleBack = () => {
        router.back();
    }

    const handleEdit = async (e) => {

        e.preventDefault();

        if (data.name != user.name || data.email != user.email
            || data.register != user.register || data.profile || user.profileId) {

            if (!data.password) delete data.password;

            try {

                const result = await axios.put(`/api/UserAPI?id=${id}`, data);

                if (result.status != 200) {

                    toast.error(result.data.error);
                    return;

                }

                getUser();
                setOpen(false);
                toast.success("Sucesso ao editar usuário");

            } catch (e) {
                toast.error(e);
            }
        } else {
            setOpen(false);
        }
    }

    const deleteUser = async () => {

        try {

            const result = await axios.delete(`/api/UserAPI?id=${id}`);

            if (result.status != 200) {
                toast.error(result.statusText);
                return;
            }

            setDeleteOpen(false);
            toast.success("Usuário excluído");
            router.push('/newUser');

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
                        <div className={styles.page}>
                            <table className={styles.table}>
                                <td>
                                    <tr><h2>Nome completo:</h2><p>{user.name}</p></tr>
                                    <tr><h2>E-mail:</h2><p>{user.email}</p></tr>
                                    <tr><h2>Matrícula:</h2><p>{user.register}</p></tr>
                                    <tr><h2>Perfil associado:</h2><p>{user.profile.name}</p></tr>
                                    <tr><h2>Data de criação:</h2><p>{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</p></tr>
                                </td>
                            </table>
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
                    contentLabel="Excluir usuário?"
                    className={styles.deleteModal}
                    overlayClassName={styles.overlay}>
                    <div className={styles.modalContent}>
                        <h2>Tem certeza que deseja excluir este usuário?</h2>
                        <p>Esta ação excluirá o usuário permanentemente!</p>
                        <div className={styles.buttonsDiv}>
                            <button type="button" onClick={() => setDeleteOpen(false)}>Cancelar</button>
                            <button className={styles.confirmBtn} type="button" onClick={deleteUser}>Excluir</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setOpen(false)}
                    contentLabel="Edição de Usuário"
                    className={styles.modal}
                    overlayClassName={styles.overlay}>
                    <form className={styles.form} onSubmit={handleEdit}>
                        <h1>Edição de usuário</h1>
                        <div className={styles.userName}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.name}
                                placeholder="Nome completo"
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.email}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.email}
                                placeholder="E-mail"
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div className={styles.email}>
                            <input
                                className={styles.input}
                                required
                                type="text"
                                value={data.register}
                                placeholder="Matrícula"
                                onChange={(e) => setData({ ...data, register: e.target.value })}
                            />
                        </div>
                        <div className={styles.password}>
                            <input
                                className={styles.input}
                                type="password"
                                value={data.password}
                                placeholder="Senha"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </div>
                        <div className={styles.profiles} style={{ marginTop: '2%' }}>
                            {profiles &&
                                <Select
                                    required
                                    styles={customStyles}
                                    className={styles.select}
                                    value={profiles.find(profile => profile.value == data.profile)}
                                    onChange={(selectedOption) => setData({ ...data, profile: selectedOption.value })}
                                    options={profiles}
                                />
                            }
                        </div>
                        <button
                            style={{ marginTop: '5%' }}
                            className={styles.registerBtn}
                            type="submit">
                            Salvar</button>
                        <button className={styles.cancel} type="button" onClick={() => setOpen(false)}>Cancelar</button>
                    </form>
                </Modal>
            </div>
        </CheckAuth>
    )
}