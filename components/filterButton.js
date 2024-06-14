import styles from 'styles/filterButton.module.css'

export default function Button({ text, onClick }) {
    return <button
        type="button"
        onClick={onClick}
        className={styles.button}>
        {text}</button>
}