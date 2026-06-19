import styles from "./footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <img src="/imgs/logomg.png" alt="" />
      <h2>Important links</h2>
      <div className={styles.linksContainer}>
        <Link className={styles.link} to={"/"}>
          HomePage
        </Link>
        <Link className={styles.link} to={"/plates"}>
          Plates
        </Link>
        <Link className={styles.link} to={"/profile"}>
          Profile
        </Link>
      </div>
      <div>
        Developed by Andrey Schwantes.
        <a href="http://linkedin.com/in/andrey-schwantes" target="_blank" className={styles.link}>
          See my projects!
        </a>
      </div>
    </footer>
  );
}
