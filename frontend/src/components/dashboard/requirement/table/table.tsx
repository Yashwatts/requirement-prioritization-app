"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Checkbox, Paper } from "@mui/material";
import MaterialReactTable, {
  type MRT_ColumnOrderState,
  type MRT_RowSelectionState,
  type MRT_SortingState,
  type MRT_VisibilityState,
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
import { saveTableSettings } from "@/features/table-settings/table-settings.slice";
import type { RequirementTableRow } from "@/types/requirement.types";
import { Header } from "./header/header";
import { Toolbar } from "./toolbar/toolbar";
import { Fallback } from "./fallback/fallback";
import { RowActions } from "./row-actions/row-actions";
import { Pagination } from "./pagination/pagination";
import { COLUMN_SORT_MAP, useColumns } from "./columns/columns";
import { TableSettingsDialog } from "./table-settings/table-settings-dialog";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import { useLocalization } from "@/localize";

export interface TableProps {
  onCreateNew: () => void;
}

export const Table = ({ onCreateNew }: TableProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { translate, locale } = useLocalization();

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

  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.uid ?? "guest";
  const savedSettings = useAppSelector(
    (state) => state.tableSettings.userSettings[currentUserId],
  );

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const columns = useColumns();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState<MRT_ColumnOrderState>(
    () => savedSettings?.columnOrder ?? [],
  );
  const [columnVisibility, setColumnVisibility] =
    useState<MRT_VisibilityState>(() => savedSettings?.columnVisibility ?? {});

  useEffect(() => {
    if (savedSettings) {
      if (savedSettings.columnOrder && savedSettings.columnOrder.length > 0) {
        setColumnOrder(savedSettings.columnOrder);
      }
      if (savedSettings.columnVisibility) {
        setColumnVisibility(savedSettings.columnVisibility);
      }
    }
  }, [savedSettings]);

  const availableColumns = useMemo<ColumnConfigItem[]>(() => {
    return columns.map((col) => ({
      id: col.accessorKey as string,
      label:
        typeof col.header === "string"
          ? col.header
          : (col.accessorKey as string),
    }));
  }, [columns]);

  const defaultColumnOrder = useMemo<string[]>(() => {
    return [
      "mrt-row-select",
      ...columns.map((col) => col.accessorKey as string),
      "mrt-row-actions",
    ];
  }, [columns]);

  useEffect(() => {
    if (status === "failed" && error) {
      showSnackbar(translate("unableToLoadRequirements"), "error");
    }
  }, [status, error, showSnackbar, translate]);

  useEffect(() => {
    dispatch(
      fetchRequirements({
        page,
        limit,
        search: search.trim() ? search.trim() : undefined,
        sortBy: sortBy ? (COLUMN_SORT_MAP[sortBy] ?? sortBy) : undefined,
        sortOrder,
      }),
    );
  }, [dispatch, page, limit, search, sortBy, sortOrder, locale]);

  const reduxSorting = useMemo<MRT_SortingState>(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: sortOrder === "DESC" }];
  }, [sortBy, sortOrder]);

  const [sorting, setSorting] = useState<MRT_SortingState>(reduxSorting);
  const sortTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [prevSortBy, setPrevSortBy] = useState(sortBy);
  const [prevSortOrder, setPrevSortOrder] = useState(sortOrder);
  if (prevSortBy !== sortBy || prevSortOrder !== sortOrder) {
    setPrevSortBy(sortBy);
    setPrevSortOrder(sortOrder);
    setSorting(reduxSorting);
  }

  const handleSortingChange = (
    updaterOrValue:
      | MRT_SortingState
      | ((old: MRT_SortingState) => MRT_SortingState),
  ) => {
    const nextSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    setSorting(nextSorting);

    if (sortTimerRef.current) {
      clearTimeout(sortTimerRef.current);
    }
    sortTimerRef.current = setTimeout(() => {
      if (nextSorting && nextSorting.length > 0) {
        dispatch(setSortBy(nextSorting[0].id));
        dispatch(setSortOrder(nextSorting[0].desc ? "DESC" : "ASC"));
      } else {
        dispatch(setSortBy(undefined));
        dispatch(setSortOrder("DESC"));
      }
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (sortTimerRef.current) {
        clearTimeout(sortTimerRef.current);
      }
    };
  }, []);

  return (
    <Box className={styles.root}>
      <Header onCreateNew={onCreateNew} />

      <Paper className={styles.workspace} elevation={0}>
        <Toolbar
          search={search}
          onSearchChange={(newSearch) => dispatch(setSearch(newSearch))}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <Box className={styles.tableFrame}>
          <MaterialReactTable<RequirementTableRow>
            columns={columns}
            data={requirements}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enablePagination={false}
            enableStickyHeader
            enableSorting
            enableMultiSort={false}
            manualSorting
            onSortingChange={handleSortingChange}
            enableRowSelection
            enableSelectAll
            getRowId={(row, index) =>
              String(row?.id ?? row?.code ?? `row-${index}`)
            }
            onRowSelectionChange={setRowSelection}
            enableTopToolbar={false}
            enableBottomToolbar={requirements.length > 0}
            enableRowActions
            layoutMode="semantic"
            positionActionsColumn="last"
            enablePinning
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 64,
                muiTableHeadCellProps: {
                  align: "center",
                  className: styles.checkboxHeadCell,
                },
                muiTableBodyCellProps: {
                  align: "center",
                  className: styles.checkboxCell,
                },
                Header: ({ table }) => (
                  <Checkbox
                    size="small"
                    className={styles.checkbox}
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
                    className={styles.checkbox}
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                ),
              },
              "mrt-row-actions": {
                header: "",
                size: 121,
                muiTableHeadCellProps: {
                  className: styles.pinnedActionsHeadCell,
                },
                muiTableBodyCellProps: {
                  className: styles.pinnedActionsBodyCell,
                },
              },
            }}
            state={{
              isLoading: false,
              showSkeletons: status === "loading" && requirements.length === 0,
              showAlertBanner: status === "failed",
              rowSelection,
              sorting,
              columnOrder: columnOrder.length > 0 ? columnOrder : undefined,
              columnVisibility,
              columnPinning: {
                right: ["mrt-row-actions"],
              },
            }}
            onColumnOrderChange={setColumnOrder}
            onColumnVisibilityChange={setColumnVisibility}
            muiTableProps={{ className: styles.table, stickyHeader: true }}
            muiTableHeadCellProps={{ className: styles.tableHeadCell }}
            muiTableBodyCellProps={{ className: styles.tableBodyCell }}
            muiTableBodyRowProps={{ className: styles.tableBodyRow }}
            muiTablePaperProps={{ className: styles.mrtPaper, elevation: 0 }}
            muiTableContainerProps={{ className: styles.tableContainer }}
            muiToolbarAlertBannerProps={{ className: styles.alertBanner }}
            muiBottomToolbarProps={{ className: styles.bottomToolbar }}
            renderBottomToolbar={() =>
              requirements.length > 0 ? (
                <Box className={styles.bottomToolbar}>
                  <Pagination
                    page={page}
                    limit={limit}
                    total={total}
                    totalPages={totalPages}
                    isLoading={status === "loading"}
                    onPageChange={(newPage) => dispatch(setPage(newPage))}
                    onLimitChange={(newLimit) => dispatch(setLimit(newLimit))}
                  />
                </Box>
              ) : null
            }
            renderEmptyRowsFallback={() => (
              <Fallback status={status} error={error} />
            )}
            renderRowActions={({ row }) => <RowActions row={row.original} />}
          />
        </Box>
      </Paper>

      <TableSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        availableColumns={availableColumns}
        columnOrder={columnOrder.length > 0 ? columnOrder : defaultColumnOrder}
        columnVisibility={columnVisibility}
        onSave={(newOrder, newVisibility) => {
          setColumnOrder(newOrder);
          setColumnVisibility(newVisibility);
          dispatch(
            saveTableSettings({
              userId: currentUserId,
              columnOrder: newOrder,
              columnVisibility: newVisibility,
            }),
          );
        }}
      />
    </Box>
  );
};
