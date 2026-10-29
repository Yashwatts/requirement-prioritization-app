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
  Tooltip,
} from "@mui/material";
import styles from "./toolbar.module.css";

export interface ToolbarProps {
  search: string;
  onSearchChange: (newSearch: string) => void;
}

export const Toolbar = ({ search, onSearchChange }: ToolbarProps) => {
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
  );
};
