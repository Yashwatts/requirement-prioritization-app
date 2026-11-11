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
}

export const RegisterForm = ({
  open,
  onClose,
  onCreated,
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
  });

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleRequestClose}
        hideBackdrop={minimized}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: minimized,
          disableEnforceFocus: minimized,
        }}
        className={`${styles.drawer} ${minimized ? styles.minimized : ""}`}
      >
        <FormProvider {...methods}>
          <Box
            className={styles.container}
            component="form"
            onSubmit={handleSubmitRequirementForm}
          >
            <Header
              minimized={minimized}
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
