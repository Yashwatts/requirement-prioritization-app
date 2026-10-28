import { Box, CircularProgress } from "@mui/material";
import styles from "./loading.module.css";

export const Loading = () => {
  return (
    <Box className={styles.container}>
      <CircularProgress size={44} thickness={4} className={styles.spinner} />
    </Box>
  );
};

export default Loading;
