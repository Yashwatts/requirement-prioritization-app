"use client";

import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { useLocalization } from "@/localize";
import styles from "./pagination.module.css";

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const Pagination = ({
  page,
  limit,
  total,
  totalPages,
  isLoading,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const { translate } = useLocalization();
  const fromRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const toRecord = Math.min(page * limit, total);
  const paginationText = `${fromRecord}-${toRecord} ${translate("of")} ${total}`;

  return (
    <Box className={styles.pagination}>
      <Box className={styles.rowsPerPageGroup}>
        <Typography className={styles.rowsPerPageText}>
          {translate("rowsPerPage")}
        </Typography>
        <Select
          className={styles.rowsPerPageSelect}
          value={limit}
          size="small"
          IconComponent={ArrowDropDownIcon}
          onChange={(event) => onLimitChange(Number(event.target.value))}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </Box>

      <Typography className={styles.paginationText}>
        {paginationText}
      </Typography>

      <Box className={styles.arrowsGroup}>
        <Tooltip title={translate("previousPage")}>
          <Box component="span">
            <IconButton
              className={styles.pageButton}
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeftIcon className={styles.pageIcon} />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title={translate("nextPage")}>
          <Box component="span">
            <IconButton
              className={styles.pageButton}
              disabled={page >= totalPages || total === 0 || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRightIcon className={styles.pageIcon} />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
