"use client";

import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
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

export type TablePaginationProps = PaginationProps;

export const Pagination = ({
  page,
  limit,
  total,
  totalPages,
  isLoading,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const fromRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const toRecord = Math.min(page * limit, total);
  const paginationText = `${fromRecord}-${toRecord} of ${total}`;

  return (
    <Box className={styles.pagination}>
      <Typography>Rows per page:</Typography>
      <Select
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
      <Typography>{paginationText}</Typography>
      <Tooltip title="Previous page">
        <Box component="span">
          <IconButton
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            <ArrowLeftIcon />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip title="Next page">
        <Box component="span">
          <IconButton
            disabled={page >= totalPages || total === 0 || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

export const TablePagination = Pagination;
