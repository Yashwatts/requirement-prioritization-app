import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import type { RequirementTableRow } from "@/types/requirement.types";
import styles from "./row-actions.module.css";

export interface RowActionsProps {
  row?: RequirementTableRow;
  onView?: (row: RequirementTableRow) => void;
  onEdit?: (row: RequirementTableRow) => void;
}

export const RowActions = ({ row, onView, onEdit }: RowActionsProps) => {
  return (
    <Box className={styles.rowActions}>
      <Tooltip title="View requirement">
        <IconButton size="small" onClick={() => row && onView && onView(row)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit requirement">
        <IconButton size="small" onClick={() => row && onEdit && onEdit(row)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
