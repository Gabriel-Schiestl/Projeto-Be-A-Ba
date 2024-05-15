

export default function NewFunction() {

    return (
        <div className={styles.container}>
            <form>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.functionName}>
                        <label>Nome:</label>
                        <input type="text" value={data.functionName} onChange={(e) => { setData({ ...data, functionName: e.target.value }) }}>
                        </input>
                    </div>
                    <div className={styles.tag}>
                        <label>TAG:</label>
                        <input type="text" value={data.tag} onChange={(e) => { setData({ ...data, tag: e.target.value }) }}></input>
                    </div>
                    <div className={styles.description}>
                        <label>Descrição:</label>
                        <textarea rows={5} cols={40} value={data.description} onChange={(e) => { setData({ ...data, description: e.target.value }) }}></textarea>
                    </div>
                    <button onClick={handleSubmit}>Salvar</button>
                    <button>Cancelar</button>
                </form>
            </form>
        </div>
    )

}