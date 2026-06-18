import styles from "./navbar.module.css";
import { LuShoppingCart, LuCircleUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarItems}>
        <Link to={"/"}>
          <img className={styles.logo} src="/imgs/logomg.png" alt="Logo MyGastronomy" />
        </Link>

        <div className={styles.navbarLinksContainer}>
          <Link to={"/"} className={styles.navbarLink}>
            Home
          </Link>
          <Link to={"/Plates"} className={styles.navbarLink}>
            Plates
          </Link>
          <Link to={"/cart"}>
            <LuShoppingCart className={styles.navbarLink} />
          </Link>
          <Link to={"/profile"}>
            <LuCircleUser className={styles.navbarLink} />
          </Link>
        </div>
      </div>

      <div className={styles.mobileNavbarItems}>
        <Link to={"/"}>
          <img className={styles.logo} src="/imgs/logomg.png" alt="" />
        </Link>
        <div className={styles.mobileNavbarBtns}>
          <Link to={"/cart"}>
            <LuShoppingCart className={styles.navbarLink} />
          </Link>

          <LuMenu className={styles.navbarLink} onClick={handleOpenMenu} />
        </div>
      </div>

      <Drawer anchor="right" open={openMenu} onClose={handleOpenMenu}>
        <div className={styles.drawer}>
          <Link to={"/"} className={styles.navbarLink}>
            Home
          </Link>
          <Link to={"/Plates"} className={styles.navbarLink}>
            Plates
          </Link>
          <Link to={"/Profile"} className={styles.navbarLink}>
            Profile
          </Link>
        </div>
      </Drawer>
    </nav>
  );
}
