import ChecklistLoader from "./components/ChecklistLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>팀 업무 체크리스트</h1>
      <ChecklistLoader />
    </main>
  );
}
