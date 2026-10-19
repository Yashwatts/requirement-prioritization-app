"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  CircularProgress,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";

import styles from "./requirements-table.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRequirements } from "@/features/requirements/requirement.action";
import {
  setLimit,
  setPage,
  setSearch,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
} from "@/features/requirements/requirement.slice";
import type { RequirementListItem } from "@/features/requirements/requirement.types";

const EmptyState = () => (
  <Box className={styles.emptyState}>
    <Box className={styles.emptyStateIllustration} aria-hidden="true">
      <Image
        src="/empty-results/empty-street.svg?v=figma-1"
        alt=""
        width={190}
        height={147}
      />
    </Box>
    <Typography className={styles.emptyStateMessage}>
      No results found. Try changing your filters.
    </Typography>
  </Box>
);

const TableHeader = ({
  label,
  onClick,
  descending = false,
  showSortIcon = true,
}: {
  label: string;
  onClick?: () => void;
  descending?: boolean;
  showSortIcon?: boolean;
}) => (
  <Button className={styles.headerButton} onClick={onClick}>
    {label}
    {showSortIcon && (
      <ArrowUpwardIcon
        style={{ transform: descending ? "rotate(180deg)" : "none" }}
      />
    )}
  </Button>
);

interface RequirementsTableProps {
  onCreateNew: () => void;
  refreshToken?: number;
}

export const RequirementsTable = ({
  onCreateNew,
  refreshToken = 0,
}: RequirementsTableProps) => {
  const dispatch = useAppDispatch();

  const {
    items,
    total,
    totalPages,
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    status,
    error,
  } = useAppSelector((state) => state.requirements);

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        dispatch(setSearch(searchInput));
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, search, dispatch]);

  // Fetch requirements whenever pagination, search, or sorting parameters change
  useEffect(() => {
    dispatch(
      fetchRequirements({
        page,
        limit,
        search: search.trim() ? search.trim() : undefined,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, page, limit, search, sortBy, sortOrder, refreshToken]);

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setSearch(""));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(setPage(page + 1));
    }
  };

  const startRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = Math.min(page * limit, total);
  const paginationText =
    total > 0 ? `${startRow}-${endRow} of ${total}` : "0-0 of 0";

  const columns = useMemo<MRT_ColumnDef<RequirementListItem>[]>(
    () => [
      {
        id: "selection",
        header: "",
        size: 64,
        Header: () => <Checkbox size="small" />,
        Cell: () => <Checkbox size="small" />,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        Header: () => (
          <TableHeader
            label="Name"
            descending={sortBy === "name" && sortOrder === "DESC"}
            onClick={() => {
              if (sortBy === "name") {
                dispatch(toggleSortOrder());
              } else {
                dispatch(setSortBy("name"));
                dispatch(setSortOrder("ASC"));
              }
            }}
          />
        ),
      },
      {
        accessorKey: "requestingInstitution",
        header: "Requesting institution",
        size: 257,
        Header: () => <TableHeader label="Requesting institution" />,
      },
      {
        accessorKey: "domain",
        header: "Domain in charge",
        size: 197,
        Header: () => <TableHeader label="Domain in charge" />,
      },
      {
        accessorKey: "code",
        header: "Column 1",
        size: 172,
        Header: () => <TableHeader label="Column 1" />,
      },
      {
        accessorKey: "requestedBy",
        header: "Column 2",
        size: 188,
        Header: () => <TableHeader label="Column 2" />,
      },
      {
        accessorKey: "type",
        header: "Column 3",
        size: 188,
        Header: () => <TableHeader label="Column 3" />,
      },
      {
        accessorKey: "totalBenefitedInstitutions",
        header: "Benefited Institutions",
        size: 187,
        Header: () => (
          <TableHeader label="Benefited Institutions" showSortIcon={false} />
        ),
        Cell: ({ cell }) => (
          <Chip className={styles.chip} label={String(cell.getValue<number>())} />
        ),
      },
      {
        accessorKey: "impact",
        header: "Impact",
        size: 162,
        Header: () => <TableHeader label="Impact" />,
        Cell: ({ cell }) => (
          <Chip className={styles.chip} label={String(cell.getValue<number>())} />
        ),
      },
    ],
    [dispatch, sortBy, sortOrder],
  );

  return (
    <Box className={styles.root}>
      <Box className={styles.heading}>
        <Typography className={styles.title}>Requirements list</Typography>
        <Button className={styles.createButton} onClick={onCreateNew}>Create new</Button>
      </Box>
      <Paper className={styles.workspace} elevation={0}>
        <Box className={styles.toolbar}>
          <TextField
            className={styles.search}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      className={styles.clearSearchButton}
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
          <Box className={styles.toolbarActions}>
            <Tooltip title="Change view">
              <Button startIcon={<ViewQuiltOutlinedIcon />}>View</Button>
            </Tooltip>
            <Tooltip title="Download requirements">
              <Button startIcon={<FileDownloadOutlinedIcon />}>Download</Button>
            </Tooltip>
            <Tooltip title="Filter requirements">
              <Button startIcon={<FilterListIcon />}>Filters</Button>
            </Tooltip>
            <Tooltip title="Table settings">
              <IconButton className={styles.toolbarIconButton}>
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More actions">
              <IconButton className={styles.toolbarIconButton}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
          <Box className={styles.tableFrame}>
          <MaterialReactTable<RequirementListItem>
            columns={columns}
            data={items}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enablePagination={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableRowActions
            layoutMode="grid"
            positionActionsColumn="last"
            displayColumnDefOptions={{
              "mrt-row-actions": {
                header: "",
                size: 121,
              },
            }}
            state={{
              isLoading: status === "loading",
              showAlertBanner: status === "failed",
            }}
            muiTableProps={{ className: styles.table, stickyHeader: true }}
            muiTableHeadCellProps={{ className: styles.tableHeadCell }}
            muiTableBodyCellProps={{ className: styles.tableBodyCell }}
            muiTableBodyRowProps={{ className: styles.tableBodyRow }}
            muiTablePaperProps={{ className: styles.mrtPaper, elevation: 0 }}
            muiTableContainerProps={{ className: styles.tableContainer }}
            muiToolbarAlertBannerProps={{ className: styles.alertBanner }}
            renderEmptyRowsFallback={() =>
              status === "failed" ? (
                <Typography className={styles.emptyStateMessage} color="error">
                  {error ?? "Unable to load requirements."}
                </Typography>
              ) : status === "loading" ? (
                <CircularProgress size={24} />
              ) : (
                <EmptyState />
              )
            }
            renderRowActions={() => (
              <Box className={styles.rowActions}>
                <Tooltip title="View requirement">
                  <IconButton size="small">
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit requirement">
                  <IconButton size="small">
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
          {items.length > 0 && (
            <Box className={styles.pagination}>
              <Typography>Rows per page:</Typography>
              <Select
                value={limit}
                size="small"
                IconComponent={ArrowDropDownIcon}
                onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
              >
                <MenuItem value={16}>16</MenuItem>
              </Select>
              <Typography>{paginationText}</Typography>
              <Tooltip title="Previous page">
                <Box component="span">
                  <IconButton
                    disabled={page <= 1 || status === "loading"}
                    onClick={handlePrevPage}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                </Box>
              </Tooltip>
              <Tooltip title="Next page">
                <Box component="span">
                  <IconButton
                    disabled={page >= totalPages || total === 0 || status === "loading"}
                    onClick={handleNextPage}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
