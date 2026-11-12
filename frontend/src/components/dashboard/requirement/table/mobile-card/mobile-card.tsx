"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import type { MRT_VisibilityState } from "material-react-table";
import type { RequirementTableRow } from "@/types/requirement.types";
import { useLocalization } from "@/localize";
import { useLongPress } from "@/hooks/use-long-press";
import { Tooltip } from "@/shared/tooltip/tooltip";
import descriptionIcon from "@/assets/svg/description-icon.svg";
import styles from "./mobile-card.module.css";

export interface MobileCardProps {
  requirement: RequirementTableRow;
  columnVisibility?: MRT_VisibilityState;
  columnOrder?: string[];
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onToggleSelect?: () => void;
  onLongPress?: () => void;
  onView?: (requirement: RequirementTableRow) => void;
  onEdit?: (requirement: RequirementTableRow) => void;
}

interface FieldRow {
  key: string;
  label: string;
  value: string;
}

export const MobileCard = ({
  requirement,
  columnVisibility,
  columnOrder,
  isSelected = false,
  isSelectionMode = false,
  onToggleSelect,
  onLongPress,
  onView,
  onEdit,
}: MobileCardProps) => {
  const { translate } = useLocalization();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const longPressProps = useLongPress({
    onLongPress: () => {
      onLongPress?.();
    },
    onClick: () => {
      if (isSelectionMode) {
        onToggleSelect?.();
      }
    },
    delay: 500,
    moveThreshold: 10,
  });

  const formatList = (items?: (string | number)[] | string | null): string => {
    if (Array.isArray(items) && items.length > 0) {
      return items.join(", ");
    }
    return items ? String(items) : "-";
  };

  const fields = useMemo<FieldRow[]>(() => {
    const allFields: FieldRow[] = [
      {
        key: "requestingInstitution",
        label: translate("requestingInstitution"),
        value: requirement.requestingInstitution || "-",
      },
      {
        key: "domain",
        label: translate("domain"),
        value: requirement.domain || "-",
      },
      {
        key: "requestedBy",
        label: translate("requestedBy"),
        value: formatList(
          requirement.requestedByList ?? requirement.requestedBy,
        ),
      },
      {
        key: "type",
        label: translate("type"),
        value: requirement.type || "-",
      },
      {
        key: "totalBenefitedInstitutions",
        label: translate("benefitedInstitutions"),
        value: formatList(
          requirement.benefitedInstitutions ??
            requirement.totalBenefitedInstitutions,
        ),
      },
      {
        key: "studyModalities",
        label: translate("studyModality"),
        value: formatList(requirement.studyModalities),
      },
      {
        key: "isObligatory",
        label: translate("mandatory"),
        value: requirement.isObligatory ? translate("yes") : translate("no"),
      },
      {
        key: "hasAlternativeSolution",
        label: translate("alternativeSolutionExists"),
        value: requirement.hasAlternativeSolution
          ? translate("yes")
          : translate("no"),
      },
      {
        key: "impactUsers",
        label: translate("userImpact"),
        value:
          requirement.impactUsers != null
            ? String(requirement.impactUsers)
            : "-",
      },
      {
        key: "impact",
        label: translate("impact"),
        value:
          requirement.impact != null ? String(requirement.impact) : "-",
      },
      {
        key: "complexityEffort",
        label: translate("complexityAndEffort"),
        value: requirement.complexityEffort
          ? String(requirement.complexityEffort)
          : "-",
      },
      {
        key: "clientPriority",
        label: translate("clientPriority"),
        value: requirement.clientPriority
          ? String(requirement.clientPriority)
          : "-",
      },
      {
        key: "status",
        label: translate("status"),
        value: requirement.status || "-",
      },
      {
        key: "collaboratorDomains",
        label: translate("collaboratorDomains"),
        value: formatList(requirement.collaboratorDomains),
      },
      {
        key: "followerDomains",
        label: translate("followerDomains"),
        value: formatList(requirement.followerDomains),
      },
      {
        key: "startDate",
        label: translate("startDate"),
        value: requirement.startDate || "-",
      },
      {
        key: "finishDate",
        label: translate("finishDate"),
        value: requirement.finishDate || "-",
      },
      {
        key: "code",
        label: translate("code"),
        value: requirement.code != null ? String(requirement.code) : "-",
      },
      {
        key: "description",
        label: translate("description"),
        value: requirement.description || "-",
      },
    ];

    let activeFields = allFields;
    if (columnVisibility) {
      activeFields = allFields.filter(
        (field) => columnVisibility[field.key] !== false,
      );
    }

    if (columnOrder && columnOrder.length > 0) {
      activeFields = [...activeFields].sort((firstField, secondField) => {
        const firstIndex = columnOrder.indexOf(firstField.key);
        const secondIndex = columnOrder.indexOf(secondField.key);
        if (firstIndex === -1 && secondIndex === -1) return 0;
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
      });
    }

    return activeFields;
  }, [requirement, columnVisibility, columnOrder, translate]);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleView = () => {
    handleCloseMenu();
    onView?.(requirement);
  };

  const handleEdit = () => {
    handleCloseMenu();
    onEdit?.(requirement);
  };

  const descriptionRaw = requirement.description ?? "";
  const hasDescriptionContent = Boolean(
    descriptionRaw && descriptionRaw.replace(/<[^>]*>?/gm, "").trim(),
  );

  return (
    <Box
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      {...longPressProps}
    >
      <Box className={styles.header}>
        <Typography className={styles.title}>
          {requirement.name}
        </Typography>
        {isSelectionMode ? (
          <Checkbox
            checked={Boolean(isSelected)}
            onChange={() => onToggleSelect?.()}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            className={styles.checkbox}
            size="small"
            aria-label={`Select ${requirement.name}`}
          />
        ) : (
          <IconButton
            className={styles.moreButton}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={handleOpenMenu}
            aria-label={translate("moreActions")}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            className: styles.menuPaper,
          },
          list: {
            className: styles.menuList,
          },
        }}
      >
        <MenuItem onClick={handleView} className={styles.menuItem}>
          <VisibilityOutlinedIcon className={styles.menuIcon} />
          <Typography className={styles.menuText}>
            {translate("view")}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit} className={styles.menuItem}>
          <EditOutlinedIcon className={styles.menuIcon} />
          <Typography className={styles.menuText}>
            {translate("edit")}
          </Typography>
        </MenuItem>
      </Menu>

      <Box className={styles.fieldsList}>
        {fields.map((field, index) => (
          <Box key={field.key}>
            {field.key === "description" ? (
              <Box className={styles.descriptionRow}>
                <span className={styles.fieldLabel}>{field.label} : </span>
                <Tooltip
                  variant="info"
                  placement="bottom-start"
                  enterTouchDelay={0}
                  leaveDelay={100}
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [-75, 8],
                          },
                        },
                        {
                          name: "preventOverflow",
                          options: {
                            padding: 12,
                          },
                        },
                      ],
                    },
                  }}
                  title={
                    <Box className={styles.tooltipBox}>
                      <Typography className={styles.tooltipTitle}>
                        {translate("description")}
                      </Typography>
                      {hasDescriptionContent ? (
                        <Box
                          className={styles.tooltipMessage}
                          dangerouslySetInnerHTML={{ __html: descriptionRaw }}
                        />
                      ) : (
                        <Typography className={styles.tooltipMessage}>
                          {translate("noDescription")}
                        </Typography>
                      )}
                    </Box>
                  }
                >
                  <Box
                    component="span"
                    className={styles.descriptionTouchArea}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                  >
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
            ) : (
              <Typography className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{field.label} : </span>
                <span className={styles.fieldValue}>{field.value}</span>
              </Typography>
            )}
            {index < fields.length - 1 && <Box className={styles.divider} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
