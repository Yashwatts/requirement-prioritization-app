import { Box } from "@mui/material";
import styles from "./network-background.module.css";

export const NetworkBackground = () => {
  return (
    <Box aria-hidden="true" className={styles.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-background/login-background.svg"
        alt=""
        className={styles.svg}
      />
    </Box>
  );
};
