"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_SortingState,
} from "material-react-table";

import styles from "./table.module.css";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRequirements } from "@/features/requirement/requirement.action";
import {
  setLimit,
  setPage,
  setSearch,
  setSortBy,
  setSortOrder,
} from "@/features/requirement/requirement.slice";
import type { RequirementTableRow, SortOrder } from "@/types/requirement.types";
import { EmptyState } from "./empty-state/empty-state";
import { Pagination } from "./pagination/pagination";

const COLUMN_SORT_MAP: Record<string, string> = {
  name: "name",
  code: "code",
  requestingInstitution: "requesting_institution_id",
  requestedBy: "requested_by",
  domain: "domain_in_charge_id",
  type: "type",
  totalBenefitedInstitutions: "total_benefited_institutions",
  isObligatory: "obligation",
  hasAlternativeSolution: "exist_solution_alternative",
  impactUsers: "impact_number_users_id",
  impact: "impact",
  complexityEffort: "complexity_and_effort",
  clientPriority: "client_priority",
  status: "status",
  startDate: "start_date",
  finishDate: "end_date",
  createdAt: "created_at",
};

const BACKEND_SORT_MAP: Record<string, string> = {
  name: "name",
  code: "code",
  requesting_institution_id: "requestingInstitution",
  requested_by: "requestedBy",
  domain_in_charge_id: "domain",
  type: "type",
  total_benefited_institutions: "totalBenefitedInstitutions",
  obligation: "isObligatory",
  exist_solution_alternative: "hasAlternativeSolution",
  impact_number_users_id: "impactUsers",
  impact: "impact",
  complexity_and_effort: "complexityEffort",
  client_priority: "clientPriority",
  status: "status",
  start_date: "startDate",
  end_date: "finishDate",
  created_at: "createdAt",
};

export interface TableProps {
  onCreateNew: () => void;
  refreshToken?: number;
}

export type RequirementsTableProps = TableProps;

export const Table = ({
  onCreateNew,
  refreshToken = 0,
}: TableProps) => {
  const dispatch = useAppDispatch();

  const {
    requirements,
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

  const { showSnackbar } = useSnackbar();

  // Show error via snackbar
  useEffect(() => {
    if (status === "failed" && error) {
      showSnackbar(error, "error");
    }
  }, [status, error, showSnackbar]);

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

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const sortDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync MRT sorting state directly from Redux
  const reduxSortingState = useMemo<MRT_SortingState>(() => {
    if (!sortBy) return [];
    const colId = BACKEND_SORT_MAP[sortBy] ?? sortBy;
    return [{ id: colId, desc: sortOrder === "DESC" }];
  }, [sortBy, sortOrder]);

  // Local active sorting state for instant UI response
  const [activeSorting, setActiveSorting] = useState<MRT_SortingState>(reduxSortingState);
  const [prevReduxSort, setPrevReduxSort] = useState(reduxSortingState);

  // Adjust local sorting during render if Redux state changed externally
  if (prevReduxSort !== reduxSortingState) {
    setPrevReduxSort(reduxSortingState);
    setActiveSorting(reduxSortingState);
  }

  // Handle server-side sorting change with instant UI update and 350ms debounced API dispatch
  const handleSortingChange = (
    updaterOrValue:
      | MRT_SortingState
      | ((old: MRT_SortingState) => MRT_SortingState),
  ) => {
    const nextSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(activeSorting)
        : updaterOrValue;

    // 1. Immediately update table header UI
    setActiveSorting(nextSorting);

    // 2. Clear any pending debounced dispatch
    if (sortDebounceRef.current) {
      clearTimeout(sortDebounceRef.current);
    }

    // 3. Debounce dispatching to Redux and fetching by 350ms
    sortDebounceRef.current = setTimeout(() => {
      if (nextSorting && nextSorting.length > 0) {
        const colId = nextSorting[0].id;
        const backendCol = COLUMN_SORT_MAP[colId] ?? colId;
        const nextOrder: SortOrder = nextSorting[0].desc ? "DESC" : "ASC";
        dispatch(setSortBy(backendCol));
        dispatch(setSortOrder(nextOrder));
      } else {
        dispatch(setSortBy(undefined));
        dispatch(setSortOrder("DESC"));
      }
    }, 350);
  };

  // Clean up debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (sortDebounceRef.current) {
        clearTimeout(sortDebounceRef.current);
      }
    };
  }, []);

  const columns = useMemo<MRT_ColumnDef<RequirementTableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 180,
      },
      {
        accessorKey: "code",
        header: "Code",
        size: 110,
      },
      {
        accessorKey: "requestingInstitution",
        header: "Requesting institution",
        size: 200,
      },
      {
        accessorKey: "requestedBy",
        header: "Requested by",
        size: 180,
        Cell: ({ row }) => {
          const list = row.original.requestedByList;
          if (Array.isArray(list) && list.length > 0) {
            return list.join(", ");
          }
          return row.original.requestedBy ? row.original.requestedBy : "-";
        },
      },
      {
        accessorKey: "domain",
        header: "Domain in charge",
        size: 190,
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 120,
      },
      {
        accessorKey: "totalBenefitedInstitutions",
        header: "Benefited institutions",
        size: 180,
        Cell: ({ row }) => {
          const benefited = row.original.benefitedInstitutions ?? [];
          const count =
            row.original.totalBenefitedInstitutions ?? benefited.length;
          const displayLabel =
            count === 1 && benefited.length > 0
              ? String(benefited[0])
              : String(count);

          return <Chip className={styles.chip} label={displayLabel} />;
        },
      },
      {
        accessorKey: "studyModalities",
        header: "Study modality",
        size: 160,
        Cell: ({ row }) => {
          const modalities = row.original.studyModalities;
          return Array.isArray(modalities) && modalities.length > 0
            ? modalities.join(", ")
            : "-";
        },
      },
      {
        accessorKey: "isObligatory",
        header: "Mandatory",
        size: 120,
        Cell: ({ row }) => (row.original.isObligatory ? "Yes" : "No"),
      },
      {
        accessorKey: "hasAlternativeSolution",
        header: "Alternative solution",
        size: 170,
        Cell: ({ row }) =>
          row.original.hasAlternativeSolution ? "Yes" : "No",
      },
      {
        accessorKey: "impactUsers",
        header: "User impact",
        size: 130,
      },
      {
        accessorKey: "impact",
        header: "Impact",
        size: 110,
        Cell: ({ cell }) => (
          <Chip
            className={styles.chip}
            label={String(cell.getValue<number>() ?? 0)}
          />
        ),
      },
      {
        accessorKey: "complexityEffort",
        header: "Complexity & effort",
        size: 160,
      },
      {
        accessorKey: "clientPriority",
        header: "Client priority",
        size: 130,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
      },
      {
        accessorKey: "collaboratorDomains",
        header: "Collaborator domains",
        size: 190,
        Cell: ({ row }) => {
          const domains = row.original.collaboratorDomains;
          return Array.isArray(domains) && domains.length > 0
            ? domains.join(", ")
            : "-";
        },
      },
      {
        accessorKey: "followerDomains",
        header: "Follower domains",
        size: 180,
        Cell: ({ row }) => {
          const domains = row.original.followerDomains;
          return Array.isArray(domains) && domains.length > 0
            ? domains.join(", ")
            : "-";
        },
      },
      {
        accessorKey: "startDate",
        header: "Start date",
        size: 130,
        Cell: ({ row }) => row.original.startDate ?? "-",
      },
      {
        accessorKey: "finishDate",
        header: "Finish date",
        size: 130,
        Cell: ({ row }) => row.original.finishDate ?? "-",
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 220,
        Cell: ({ row }) => {
          const raw = row.original.description ?? "";
          const clean = raw.replace(/<[^>]*>?/gm, "").trim();
          return (
            <Tooltip title={clean} placement="top-start">
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                }}
              >
                {clean ? clean : "-"}
              </Typography>
            </Tooltip>
          );
        },
      },
    ],
    [],
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
          <MaterialReactTable<RequirementTableRow>
            columns={columns}
            data={requirements}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enablePagination={false}
            enableSorting
            enableMultiSort={false}
            manualSorting
            enableRowSelection
            enableSelectAll
            getRowId={(row, index) =>
              String(row?.id ?? row?.code ?? `row-${index}`)
            }
            onRowSelectionChange={setRowSelection}
            onSortingChange={handleSortingChange}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableRowActions
            layoutMode="semantic"
            positionActionsColumn="last"
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 56,
                Header: ({ table }) => (
                  <Checkbox
                    size="small"
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={
                      table.getIsSomeRowsSelected() &&
                      !table.getIsAllRowsSelected()
                    }
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                ),
                Cell: ({ row }) => (
                  <Checkbox
                    size="small"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                ),
              },
              "mrt-row-actions": {
                header: "",
                size: 100,
                muiTableHeadCellProps: {
                  className: styles.stickyActionsHeadCell,
                },
                muiTableBodyCellProps: {
                  className: styles.stickyActionsBodyCell,
                },
              },
            }}
            enablePinning
            initialState={{
              columnPinning: {
                right: ["mrt-row-actions"],
              },
            }}
            state={{
              isLoading: false,
              showSkeletons: status === "loading" && requirements.length === 0,
              showAlertBanner: status === "failed",
              rowSelection,
              sorting: activeSorting,
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
                <Stack spacing={1} sx={{ width: "100%", p: 2 }}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={40}
                      animation="wave"
                      sx={{ borderRadius: 1, bgcolor: "rgba(0, 0, 0, 0.04)" }}
                    />
                  ))}
                </Stack>
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
          {requirements.length > 0 && (
            <Pagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              isLoading={status === "loading"}
              onPageChange={(newPage) => dispatch(setPage(newPage))}
              onLimitChange={(newLimit) => dispatch(setLimit(newLimit))}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export const RequirementsTable = Table;
