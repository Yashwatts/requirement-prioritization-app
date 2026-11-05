"use client";

import { Box, Typography } from "@mui/material";
import { useLocalization } from "@/localize";
import { FormSelectField } from "../form-select-field/form-select-field";
import { STUDY_MODALITIES, YES_NO_OPTIONS } from "@/types/requirement.types";
import styles from "./beneficiaries-scope.module.css";

interface BeneficiariesScopeProps {
  benefitedInstitutionOptions: readonly string[];
  isInstitutionsLoading: boolean;
  onOpenInstitutions: () => void;
}

export const BeneficiariesScope = ({
  benefitedInstitutionOptions,
  isInstitutionsLoading,
  onOpenInstitutions,
}: BeneficiariesScopeProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.container}>
      <Typography className={styles.sectionTitle}>
        {translate("beneficiariesAndScope")}
      </Typography>

      <FormSelectField
        name="benefitedInstitutions"
        label={translate("benefitedInstitutions")}
        options={benefitedInstitutionOptions}
        multiple
        onOpen={onOpenInstitutions}
        isLoading={isInstitutionsLoading}
      />

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="studyModality"
          label={translate("studyModality")}
          options={STUDY_MODALITIES}
        />
        <FormSelectField
          name="isObligatory"
          label={translate("mandatory")}
          options={YES_NO_OPTIONS}
        />
      </Box>

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="hasAlternativeSolution"
          label={translate("alternativeSolutionExists")}
          options={YES_NO_OPTIONS}
        />
        <Box />
      </Box>
    </Box>
  );
};
