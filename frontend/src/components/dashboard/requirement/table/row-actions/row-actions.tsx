import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, IconButton } from "@mui/material";
import type { RequirementTableRow } from "@/types/requirement.types";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { useLocalization } from "@/localize";
import styles from "./row-actions.module.css";

export interface RowActionsProps {
  row?: RequirementTableRow;
  onView?: (row: RequirementTableRow) => void;
  onEdit?: (row: RequirementTableRow) => void;
}

export const RowActions = ({ row, onView, onEdit }: RowActionsProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.rowActions}>
      <Tooltip title={translate("viewRequirement")}>
        <IconButton size="small" onClick={() => row && onView && onView(row)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={translate("editRequirement")}>
        <IconButton size="small" onClick={() => row && onEdit && onEdit(row)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
