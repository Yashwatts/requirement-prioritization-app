"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Table } from "@/components/dashboard/requirement/table/table";
import { RegisterForm } from "@/components/dashboard/requirement/register-form/register-form";
import { ConfirmDialog } from "@/shared/confirm-dialog/confirm-dialog";
import { useLocalization } from "@/localize";
import { useAppDispatch } from "@/store/hooks";
import { fetchRequirements } from "@/features/requirement/requirement.action";
import styles from "./dashboard-view.module.css";

export const DashboardView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const dispatch = useAppDispatch();
  const { translate } = useLocalization();

  const handleCreateNew = () => {
    if (isFormMinimized) {
      setDiscardDialogOpen(true);
    } else {
      setCreateOpen(true);
    }
  };

  const handleRestoreForm = () => {
    setIsFormMinimized(false);
    setCreateOpen(true);
  };

  const handleConfirmDiscard = () => {
    setDiscardDialogOpen(false);
    setIsFormMinimized(false);
    setFormKey((prev) => prev + 1);
    setCreateOpen(true);
  };

  const handleCancelDiscard = () => {
    setDiscardDialogOpen(false);
  };

  const handleCloseForm = () => {
    setCreateOpen(false);
    setIsFormMinimized(false);
  };

  return (
    <Box className={styles.container}>
      <Table
        onCreateNew={handleCreateNew}
        isFormMinimized={isFormMinimized}
        onRestoreForm={handleRestoreForm}
      />
      <RegisterForm
        key={formKey}
        open={createOpen}
        minimized={isFormMinimized}
        onMinimizedChange={setIsFormMinimized}
        onClose={handleCloseForm}
        onCreated={() => {
          dispatch(fetchRequirements());
          setIsFormMinimized(false);
        }}
      />
      <ConfirmDialog
        open={discardDialogOpen}
        title={translate("discardDialogTitle")}
        description={translate("discardDialogText")}
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
      />
    </Box>
  );
};
