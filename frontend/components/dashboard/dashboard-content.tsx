"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { RequirementsTable } from "@/components/dashboard/requirements-table/requirements-table";
import { CreateRequirementDrawer } from "@/components/dashboard/create-requirement/create-requirement-drawer";

export const DashboardContent = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [requirementsRefreshToken, setRequirementsRefreshToken] = useState(0);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <RequirementsTable
        onCreateNew={() => setCreateOpen(true)}
        refreshToken={requirementsRefreshToken}
      />
      <CreateRequirementDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRequirementsRefreshToken((value) => value + 1)}
      />
    </Box>
  );
};
