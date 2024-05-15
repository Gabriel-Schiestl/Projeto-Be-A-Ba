

export default function NewProfile() {

    return (
        <div className={styles.container}>
            <form>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.userName}>
                        <input type="text"
                            value={data.userName}
                            placeholder="Nome completo"
                            onChange={(e) => { setData({ ...data, userName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.email}>
                        <input type="text"
                            value={data.email}
                            placeholder="E-mail"
                            onChange={(e) => { setData({ ...data, email: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.password}>
                        <input type="text"
                            value={data.password}
                            placeholder="Senha"
                            onChange={(e) => { setData({ ...data, password: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.profiles}>
                        <input type='checkbox'></input>
                        <label>Caixa VC</label>
                        <input type='checkbox'></input>
                        <label>Estabelecimento</label>
                    </div>
                    <button onClick={handleSubmit}>Cadastrar</button>
                    <button>Cancelar</button>
                </form>
            </form>
        </div>
    )
}