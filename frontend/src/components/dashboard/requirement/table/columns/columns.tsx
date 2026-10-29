import { useMemo } from "react";
import { Chip, Tooltip, Typography } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";
import type { RequirementTableRow } from "@/types/requirement.types";
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

export const useColumns = (): MRT_ColumnDef<RequirementTableRow>[] => {
  return useMemo<MRT_ColumnDef<RequirementTableRow>[]>(
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
        enableSorting: false,
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
        enableSorting: false,
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
        enableSorting: false,
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
        Cell: ({ row }) => (row.original.hasAlternativeSolution ? "Yes" : "No"),
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
        enableSorting: false,
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
        enableSorting: false,
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
        enableSorting: false,
        Cell: ({ row }) => {
          const raw = row.original.description ?? "";
          const clean = raw.replace(/<[^>]*>?/gm, "").trim();
          return (
            <Tooltip title={clean} placement="top-start">
              <Typography className={styles.descriptionText}>
                {clean ? clean : "-"}
              </Typography>
            </Tooltip>
          );
        },
      },
    ],
    [],
  );
};
