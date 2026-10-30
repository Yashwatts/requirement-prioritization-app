"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Checkbox, Paper } from "@mui/material";
import MaterialReactTable, {
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
import type { RequirementTableRow } from "@/types/requirement.types";
import { Header } from "./header/header";
import { Toolbar } from "./toolbar/toolbar";
import { Fallback } from "./fallback/fallback";
import { RowActions } from "./row-actions/row-actions";
import { Pagination } from "./pagination/pagination";
import { COLUMN_SORT_MAP, useColumns } from "./columns/columns";

export interface TableProps {
  onCreateNew: () => void;
}

export const Table = ({ onCreateNew }: TableProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

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

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const columns = useColumns();

  useEffect(() => {
    if (status === "failed" && error) {
      showSnackbar(error, "error");
    }
  }, [status, error, showSnackbar]);

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
  }, [dispatch, page, limit, search, sortBy, sortOrder]);

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
                  className: styles.checkboxHeadCell,
                },
                muiTableBodyCellProps: {
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
              columnPinning: {
                right: ["mrt-row-actions"],
              },
            }}
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
    </Box>
  );
};
