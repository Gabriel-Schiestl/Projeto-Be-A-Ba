

export default function NewTransaction() {

    return (
        <div className={styles.container}>
            <form>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.transactionName}>
                        <label>Nome:</label>
                        <input type="text" value={data.transactionName} onChange={(e) => { setData({ ...data, transactionName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.tag}>
                        <label>TAG:</label>
                        <input type="text" value={data.tag} onChange={(e) => { setData({ ...data, tag: e.target.value }) }}></input>
                    </div>
                    <div className={styles.functions}>
                        <label>Funções:</label>
                        <input type='checkbox'></input>
                        <label>Adicionar (ADAT)</label>
                        <input type='checkbox'></input>
                        <label>Alterar (ALTR)</label>
                        <input type='checkbox'></input>
                        <label>Visualizar (RETR)</label>
                        <input type='checkbox'></input>
                        <label>Adicionar restrição (ADIC)</label>
                    </div>
                    <button onClick={handleSubmit}>Salvar</button>
                    <button>Cancelar</button>
                </form>
            </form>
        </div>
    )
}