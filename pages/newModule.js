

export default function NewTransaction() {

    return (
        <div className={styles.container}>
            <form>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.moduleName}>
                        <label>Nome:</label>
                        <input type="text" value={data.moduleName} onChange={(e) => { setData({ ...data, moduleName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.tag}>
                        <label>TAG:</label>
                        <input type="text" value={data.tag} onChange={(e) => { setData({ ...data, tag: e.target.value }) }}></input>
                    </div>
                    <div className={styles.transactions}>
                        <label>Transações:</label>
                        <input type='checkbox'></input>
                        <label>Risk Price (RKPC)</label>
                        <input type='checkbox'></input>
                        <label>Produto Fatura (PRFA)</label>
                        <input type='checkbox'></input>
                        <label>Desconto em Folha (DEFO)</label>
                        <input type='checkbox'></input>
                        <label>Pessoa física (PEFI)</label>
                        <input type='checkbox'></input>
                        <label>Pessoa Jurídica (PEJU)</label>
                    </div>
                    <button onClick={handleSubmit}>Salvar</button>
                    <button>Cancelar</button>
                </form>
            </form>
        </div>
    )
}