import { Skeleton, Stack, Typography } from "@mui/material";
import { EmptyState } from "../empty-state/empty-state";
import styles from "./fallback.module.css";

export interface FallbackProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const Fallback = ({ status, error }: FallbackProps) => {
  if (status === "failed") {
    return (
      <Typography className={styles.emptyStateMessage} color="error">
        {error ?? "Unable to load requirements."}
      </Typography>
    );
  }

  if (status === "loading") {
    return (
      <Stack spacing={1} className={styles.skeletonContainer}>
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={40}
            animation="wave"
            className={styles.skeletonRow}
          />
        ))}
      </Stack>
    );
  }

  return <EmptyState />;
};
