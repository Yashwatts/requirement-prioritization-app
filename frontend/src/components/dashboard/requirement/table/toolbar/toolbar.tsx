"use client";

import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { useLocalization } from "@/localize";
import styles from "./toolbar.module.css";

export interface ToolbarProps {
  search: string;
  onSearchChange: (newSearch: string) => void;
  onOpenSettings?: () => void;
}

export const Toolbar = ({
  search,
  onSearchChange,
  onOpenSettings,
}: ToolbarProps) => {
  const { translate } = useLocalization();
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, search, onSearchChange]);

  const handleClearSearch = () => {
    setSearchInput("");
    onSearchChange("");
  };

  return (
    <Box className={styles.toolbar}>
      <Box className={styles.searchContainer}>
        <TextField
          className={styles.search}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={translate("search")}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  className={styles.searchStartAdornment}
                >
                  <SearchIcon className={styles.searchIcon} />
                </InputAdornment>
              ),
              endAdornment: searchInput ? (
                <InputAdornment
                  position="end"
                  className={styles.searchEndAdornment}
                >
                  <IconButton
                    aria-label={translate("clearSearch")}
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
      </Box>

      <Box className={styles.actionsContainer}>
        <Box className={styles.buttonActions}>
          <Tooltip title={translate("changeView")}>
            <Button
              startIcon={<ViewQuiltOutlinedIcon />}
              className={styles.viewButton}
            >
              {translate("view")}
            </Button>
          </Tooltip>
          <Tooltip title={translate("downloadRequirements")}>
            <Button
              startIcon={<FileDownloadOutlinedIcon />}
              className={styles.downloadButton}
            >
              {translate("download")}
            </Button>
          </Tooltip>
          <Tooltip title={translate("filterRequirements")}>
            <Button
              startIcon={<FilterListIcon />}
              className={styles.filterButton}
            >
              {translate("filters")}
            </Button>
          </Tooltip>
        </Box>

        <Box className={styles.iconActions}>
          <Tooltip title={translate("tableSettings")}>
            <IconButton
              className={styles.toolbarIconButton}
              onClick={onOpenSettings}
              aria-label={translate("tableSettings")}
            >
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={translate("moreActions")}>
            <IconButton
              className={styles.toolbarIconButton}
              aria-label={translate("moreActions")}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
