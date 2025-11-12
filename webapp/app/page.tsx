import dynamic from "next/dynamic";
import styles from "./page.module.css";

const Experience = dynamic(() => import("@/components/Experience"), { ssr: false });

export default function Page() {
  return (
    <main className={styles.main}>
      <Experience />
      <div className="overlay">
        <h1>Awakening the Sentinel</h1>
      </div>
      <div className="hint">CLICK OR TAP TO LET THE THUNDER SPEAK</div>
    </main>
  );
}
