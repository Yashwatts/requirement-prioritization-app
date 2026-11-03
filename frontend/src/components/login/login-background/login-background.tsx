import Image from "next/image";
import { Box } from "@mui/material";
import loginBackground from "@/assets/svg/login-background.svg";
import loginMobileBackground from "@/assets/svg/login-mobile-background.svg";
import styles from "./login-background.module.css";

export const LoginBackground = () => {
  return (
    <Box aria-hidden="true" className={styles.container}>
      <Image
        src={loginBackground}
        alt=""
        fill
        priority
        className={styles.desktopSvg}
      />
      <Image
        src={loginMobileBackground}
        alt=""
        fill
        priority
        className={styles.mobileSvg}
      />
    </Box>
  );
};
