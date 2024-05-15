

export default function NewProfile() {

    return (
        <div className={styles.container}>
            <form>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.profileName}>
                        <label>Nome:</label>
                        <input type="text" value={data.profileName} onChange={(e) => { setData({ ...data, profileName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.modules}>
                        <label>Módulos:</label>
                        <input type='checkbox'></input>
                        <label>Cadastro (CA)</label>
                        <input type='checkbox'></input>
                        <label>Digitalização (DG)</label>
                        <input type='checkbox'></input>
                        <label>Fichas VerdeCard (FV)</label>
                        <input type='checkbox'></input>
                        <label>VerdeCard (SC)</label>
                        <input type='checkbox'></input>
                        <label>Lojista Afiliado (VC)</label>
                        <input type='checkbox'></input>
                        <label>Controle (VG)</label>
                    </div>
                    <button onClick={handleSubmit}>Salvar</button>
                    <button>Cancelar</button>
                </form>
            </form>
        </div>
    )
}