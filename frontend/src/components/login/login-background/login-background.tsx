import { Box } from "@mui/material";
import styles from "./login-background.module.css";

export const LoginBackground = () => {
  return (
    <Box aria-hidden="true" className={styles.container}>
      <Box
        component="img"
        src="/login-background/figma-network-bg.svg"
        alt=""
        className={styles.svg}
      />
    </Box>
  );
};
