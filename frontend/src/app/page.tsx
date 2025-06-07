import Image from "next/image";
import Styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <header className={Styles.header}>
        <img src="/images/logo.png" className={Styles.logo}/>
        <h1>FoodSnap AI</h1>
      </header>
      <section className="info">
        <div className="info-top">
          <p>Cooking revolution</p>
        </div>
        <div>
          <p>
            Upload your photo and get <span>recipe immedeately</span>
          </p>
        </div>
      </section>
    </main>
  );
}
