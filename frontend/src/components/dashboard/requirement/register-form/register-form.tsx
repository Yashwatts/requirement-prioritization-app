"use client";

import { FormProvider } from "react-hook-form";
import { Box, Drawer } from "@mui/material";
import { ConfirmDialog } from "@/shared/confirm-dialog/confirm-dialog";
import { useLocalization } from "@/localize";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { GeneralInfo } from "./general-info/general-info";
import { BeneficiariesScope } from "./beneficiaries-scope/beneficiaries-scope";
import { ImpactFeasibility } from "./impact-feasibility/impact-feasibility";
import { Timeline } from "./timeline/timeline";
import { Description } from "./description/description";
import { useRegisterRequirementForm } from "@/hooks/use-register-requirement-form";
import styles from "./register-form.module.css";

export interface RegisterFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  minimized?: boolean;
  onMinimizedChange?: (minimized: boolean) => void;
}

export const RegisterForm = ({
  open,
  onClose,
  onCreated,
  minimized: propMinimized,
  onMinimizedChange,
}: RegisterFormProps) => {
  const { translate } = useLocalization();

  const {
    methods,
    minimized,
    discardDialogOpen,
    isSubmitting,
    isInstitutionsLoading,
    isDomainsLoading,
    isImpactUsersLoading,
    institutionOptions,
    benefitedInstitutionOptions,
    domainOptions,
    impactOptions,
    handleToggleMinimize,
    handleRequestClose,
    handleConfirmDiscard,
    handleCloseDiscardDialog,
    handleInstitutionsOpen,
    handleDomainsOpen,
    handleImpactUsersOpen,
    handleSubmitRequirementForm,
  } = useRegisterRequirementForm({
    open,
    onClose,
    onCreated,
    minimized: propMinimized,
    onMinimizedChange,
  });

  return (
    <>
      <Drawer
        anchor="right"
        open={open && !minimized}
        onClose={handleRequestClose}
        ModalProps={{
          keepMounted: true,
        }}
        className={styles.drawer}
      >
        <FormProvider {...methods}>
          <Box
            className={styles.container}
            component="form"
            onSubmit={handleSubmitRequirementForm}
          >
            <Header
              minimized={false}
              onToggleMinimize={handleToggleMinimize}
              onClose={handleRequestClose}
              isSubmitting={isSubmitting}
            />

            <Box className={styles.scrollContent}>
              <Box className={styles.formContent}>
                <GeneralInfo
                  institutionOptions={institutionOptions}
                  domainOptions={domainOptions}
                  isInstitutionsLoading={isInstitutionsLoading}
                  isDomainsLoading={isDomainsLoading}
                  onOpenInstitutions={handleInstitutionsOpen}
                  onOpenDomains={handleDomainsOpen}
                />

                <BeneficiariesScope
                  benefitedInstitutionOptions={benefitedInstitutionOptions}
                  isInstitutionsLoading={isInstitutionsLoading}
                  onOpenInstitutions={handleInstitutionsOpen}
                />

                <ImpactFeasibility
                  impactOptions={impactOptions}
                  isImpactUsersLoading={isImpactUsersLoading}
                  onOpenImpactUsers={handleImpactUsersOpen}
                />

                <Timeline />

                <Description />
              </Box>
            </Box>

            <Footer isSubmitting={isSubmitting} />
          </Box>
        </FormProvider>
      </Drawer>

      {open && minimized && (
        <Box className={styles.desktopMinimizedBar}>
          <Header
            minimized={minimized}
            onToggleMinimize={handleToggleMinimize}
            onClose={handleRequestClose}
            isSubmitting={isSubmitting}
          />
        </Box>
      )}

      <ConfirmDialog
        open={discardDialogOpen}
        title={translate("discardDialogTitle")}
        description={translate("discardDialogText")}
        cancelLabel={translate("cancel")}
        confirmLabel={translate("discard")}
        onCancel={handleCloseDiscardDialog}
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};
