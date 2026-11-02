import { useMemo } from "react";
import Image from "next/image";
import { Box, Chip, Typography } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";
import type { RequirementTableRow } from "@/types/requirement.types";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { ChipList } from "@/shared/chip-list/chip-list";
import { useLocalization } from "@/localize";
import descriptionIcon from "@/assets/svg/description-icon.svg";
import styles from "./columns.module.css";

export const COLUMN_SORT_MAP: Record<string, string> = {
  name: "name",
  code: "code",
  requestingInstitution: "requesting_institution_id",
  domain: "domain_in_charge_id",
  type: "type",
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

interface SingleTextCellProps {
  text?: string | null;
}

const SingleTextCell = ({ text }: SingleTextCellProps) => {
  const val = text ?? "";
  if (!val) return <span>-</span>;

  return (
    <Tooltip placement="bottom-start" title={val}>
      <Box component="span" className={styles.singleFieldText}>
        {val}
      </Box>
    </Tooltip>
  );
};

export const useColumns = (): MRT_ColumnDef<RequirementTableRow>[] => {
  const { translate } = useLocalization();

  return useMemo<MRT_ColumnDef<RequirementTableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: translate("name"),
        size: 250,
        maxSize: 250,
        muiTableHeadCellProps: {
          className: styles.nameHeaderCell,
        },
        muiTableBodyCellProps: {
          className: styles.nameBodyCell,
        },
        Cell: ({ row }) => <SingleTextCell text={row.original.name} />,
      },
      {
        accessorKey: "code",
        header: translate("code"),
        size: 140,
        maxSize: 140,
      },
      {
        accessorKey: "requestingInstitution",
        header: translate("requestingInstitution"),
        size: 250,
        maxSize: 250,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => (
          <SingleTextCell text={row.original.requestingInstitution} />
        ),
      },
      {
        accessorKey: "requestedBy",
        header: translate("requestedBy"),
        size: 250,
        maxSize: 250,
        enableSorting: false,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => {
          const list = row.original.requestedByList;
          const items =
            Array.isArray(list) && list.length > 0
              ? list
              : row.original.requestedBy
                ? [row.original.requestedBy]
                : [];
          return <ChipList items={items} />;
        },
      },
      {
        accessorKey: "domain",
        header: translate("domain"),
        size: 250,
        maxSize: 250,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => <SingleTextCell text={row.original.domain} />,
      },
      {
        accessorKey: "type",
        header: translate("type"),
        size: 150,
        maxSize: 150,
      },
      {
        accessorKey: "totalBenefitedInstitutions",
        header: translate("benefitedInstitutions"),
        size: 250,
        maxSize: 250,
        enableSorting: false,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => {
          const list = row.original.benefitedInstitutions ?? [];
          const items =
            list.length > 0
              ? list.map(String)
              : row.original.totalBenefitedInstitutions
                ? [String(row.original.totalBenefitedInstitutions)]
                : [];
          return <ChipList items={items} />;
        },
      },
      {
        accessorKey: "studyModalities",
        header: translate("studyModality"),
        size: 220,
        maxSize: 220,
        enableSorting: false,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth220,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth220,
        },
        Cell: ({ row }) => {
          const modalities = row.original.studyModalities ?? [];
          return <ChipList items={modalities.map(String)} />;
        },
      },
      {
        accessorKey: "isObligatory",
        header: translate("mandatory"),
        size: 160,
        maxSize: 160,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
        Cell: ({ row }) =>
          row.original.isObligatory ? translate("yes") : translate("no"),
      },
      {
        accessorKey: "hasAlternativeSolution",
        header: translate("alternativeSolutionExists"),
        size: 260,
        maxSize: 260,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
        Cell: ({ row }) =>
          row.original.hasAlternativeSolution
            ? translate("yes")
            : translate("no"),
      },
      {
        accessorKey: "impactUsers",
        header: translate("userImpact"),
        size: 190,
        maxSize: 190,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
      },
      {
        accessorKey: "impact",
        header: translate("impact"),
        size: 140,
        maxSize: 140,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
        Cell: ({ cell }) => (
          <Chip
            className={styles.chip}
            label={String(cell.getValue<number>() ?? 0)}
          />
        ),
      },
      {
        accessorKey: "complexityEffort",
        header: translate("complexityAndEffort"),
        size: 240,
        maxSize: 240,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
      },
      {
        accessorKey: "clientPriority",
        header: translate("clientPriority"),
        size: 170,
        maxSize: 170,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
      },
      {
        accessorKey: "status",
        header: translate("status"),
        size: 160,
        maxSize: 160,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.centerAlignHeadCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.centerAlignCell,
        },
      },
      {
        accessorKey: "collaboratorDomains",
        header: translate("collaboratorDomains"),
        size: 250,
        maxSize: 250,
        enableSorting: false,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => {
          const domains = row.original.collaboratorDomains ?? [];
          return <ChipList items={domains.map(String)} />;
        },
      },
      {
        accessorKey: "followerDomains",
        header: translate("followerDomains"),
        size: 250,
        maxSize: 250,
        enableSorting: false,
        muiTableHeadCellProps: {
          className: styles.cellMaxWidth250,
        },
        muiTableBodyCellProps: {
          className: styles.cellMaxWidth250,
        },
        Cell: ({ row }) => {
          const domains = row.original.followerDomains ?? [];
          return <ChipList items={domains.map(String)} />;
        },
      },
      {
        accessorKey: "startDate",
        header: translate("startDate"),
        size: 160,
        maxSize: 160,
        Cell: ({ row }) => row.original.startDate ?? "-",
      },
      {
        accessorKey: "finishDate",
        header: translate("finishDate"),
        size: 160,
        maxSize: 160,
        Cell: ({ row }) => row.original.finishDate ?? "-",
      },
      {
        accessorKey: "description",
        header: translate("description"),
        size: 140,
        minSize: 140,
        maxSize: 140,
        enableSorting: false,
        muiTableHeadCellProps: {
          align: "center",
          className: styles.descriptionHeaderCell,
        },
        muiTableBodyCellProps: {
          align: "center",
          className: styles.descriptionBodyCell,
        },
        Cell: ({ row }) => {
          const raw = row.original.description ?? "";
          const hasContent = Boolean(
            raw && raw.replace(/<[^>]*>?/gm, "").trim(),
          );

          return (
            <Box className={styles.descriptionWrapper}>
              <Tooltip
                variant="info"
                placement="bottom-end"
                enterTouchDelay={0}
                leaveDelay={100}
                title={
                  <Box className={styles.tooltipBox}>
                    <Typography className={styles.tooltipTitle}>
                      {translate("description")}
                    </Typography>
                    {hasContent ? (
                      <Box
                        className={styles.tooltipMessage}
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <Typography className={styles.tooltipMessage}>
                        {translate("noDescription")}
                      </Typography>
                    )}
                  </Box>
                }
              >
                <Box className={styles.descriptionTouchArea}>
                  <Image
                    src={descriptionIcon}
                    alt={translate("description")}
                    width={20}
                    height={20}
                    className={styles.descriptionIcon}
                  />
                </Box>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [translate],
  );
};
