"use client";

import { useEffect, useState } from "react";
import type { UseFormGetValues } from "react-hook-form";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import { useLocalization } from "@/localize";
import type { RequirementFormValues } from "@/schemas/requirement.schema";

export interface UseRegisterFormNavigationParameters {
  open: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  getValues: UseFormGetValues<RequirementFormValues>;
  onForceClose: () => void;
}

export interface UseRegisterFormNavigationReturn {
  minimized: boolean;
  discardDialogOpen: boolean;
  handleToggleMinimize: () => void;
  handleRequestClose: () => void;
  handleConfirmDiscard: () => void;
  handleCloseDiscardDialog: () => void;
  resetNavigationState: () => void;
}

export const useRegisterFormNavigation = ({
  open,
  isDirty,
  isSubmitting,
  getValues,
  onForceClose,
}: UseRegisterFormNavigationParameters): UseRegisterFormNavigationReturn => {
  const { showSnackbar } = useSnackbar();
  const { translate } = useLocalization();

  const [minimized, setMinimized] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (beforeUnloadEvent: BeforeUnloadEvent) => {
      if (!open) return;

      const currentFormValues = getValues();
      const hasMeaningfulContent =
        isDirty ||
        Boolean(currentFormValues.name?.trim()) ||
        Boolean(currentFormValues.description?.trim()) ||
        (Array.isArray(currentFormValues.requestedBy) &&
          currentFormValues.requestedBy.length > 0) ||
        Boolean(currentFormValues.requestingInstitution) ||
        Boolean(currentFormValues.domain) ||
        (Array.isArray(currentFormValues.benefitedInstitutions) &&
          currentFormValues.benefitedInstitutions.length > 0);

      if (hasMeaningfulContent && !isSubmitting) {
        beforeUnloadEvent.preventDefault();
        beforeUnloadEvent.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [open, isDirty, isSubmitting, getValues]);

  const resetNavigationState = () => {
    setMinimized(false);
    setDiscardDialogOpen(false);
  };

  const handleRequestClose = () => {
    if (isDirty) {
      setDiscardDialogOpen(true);
    } else {
      onForceClose();
    }
  };

  const handleConfirmDiscard = () => {
    onForceClose();
    showSnackbar(translate("requirementRegistrationCancelled"), "info");
  };

  const handleCloseDiscardDialog = () => {
    setDiscardDialogOpen(false);
  };

  const handleToggleMinimize = () => {
    setMinimized((isCurrentlyMinimized) => !isCurrentlyMinimized);
  };

  return {
    minimized,
    discardDialogOpen,
    handleToggleMinimize,
    handleRequestClose,
    handleConfirmDiscard,
    handleCloseDiscardDialog,
    resetNavigationState,
  };
};

