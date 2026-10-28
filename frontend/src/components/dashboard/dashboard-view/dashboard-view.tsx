"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Table } from "@/components/dashboard/requirement/table/table";
import { CreateRequirementDrawer } from "@/components/dashboard/requirement/create-requirement/create-requirement-drawer";
import { useAppDispatch } from "@/store/hooks";
import { fetchRequirements } from "@/features/requirement/requirement.action";

export const DashboardView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Table onCreateNew={() => setCreateOpen(true)} />
      <CreateRequirementDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          dispatch(fetchRequirements());
        }}
      />
    </Box>
  );
};
