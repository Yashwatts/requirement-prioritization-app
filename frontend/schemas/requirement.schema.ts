import { z } from "zod";

// ============================================================
// Requirement Creation Form Validation Schema (Aligned with SRS & Backend)
// ============================================================

export const requirementFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(250, "Name must not exceed 250 characters"),

    requestedBy: z
      .string()
      .trim()
      .min(1, "Requested by is required")
      .max(250, "Requester name must not exceed 250 characters"),

    requestingInstitution: z
      .string()
      .min(1, "Requesting institution is required"),

    type: z.string().min(1, "Type is required"),

    domain: z.string().min(1, "Domain in charge is required"),

    collaboratorDomains: z.array(z.string()),

    followerDomains: z.array(z.string()),

    benefitedInstitutions: z
      .array(z.string())
      .min(1, "At least one benefited institution is required"),

    studyModalities: z
      .array(z.string())
      .min(1, "At least one study modality is required"),

    isObligatory: z.boolean(),

    hasAlternativeSolution: z.boolean(),

    impactUsers: z.string().min(1, "User impact is required"),

    impact: z.union([z.string(), z.number()]).optional(),

    complexityEffort: z.string().min(1, "Complexity and effort is required"),

    clientPriorityOverride: z.string().optional(),

    managementPriority: z.string().optional(),

    startDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        "Start date must be a valid date",
      ),

    finishDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        "Finish date must be a valid date",
      ),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(500, "Description must not exceed 500 characters"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.finishDate) {
        return new Date(data.finishDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "Finish date must be after or equal to start date",
      path: ["finishDate"],
    },
  );

export type RequirementFormValues = z.infer<typeof requirementFormSchema>;

// Alias for PascalCase naming convention
export const RequirementFormSchema = requirementFormSchema;

// ============================================================
// Zod schemas mirroring backend API response shapes
// Used for runtime validation of requirements list responses
// ============================================================

export const RequirementListItemSchema = z.object({
  id: z.string(),
  code: z.number().int().positive(),
  name: z.string(),
  requestingInstitution: z.string(),
  requestedBy: z.string(),
  domain: z.string(),
  collaboratorDomains: z.array(z.string()),
  followerDomains: z.array(z.string()),
  benefitedInstitutions: z.array(z.string()),
  totalBenefitedInstitutions: z.number().int().nonnegative(),
  isObligatory: z.boolean(),
  hasAlternativeSolution: z.boolean(),
  studyModalities: z.array(z.string()),
  impactUsers: z.string(),
  impact: z.number(),
  complexityEffort: z.string(),
  clientPriority: z.string(),
  managementPriority: z.string(),
  state: z.string(),
  type: z.string(),
  startDate: z.string().nullable(),
  finishDate: z.string().nullable(),
  createdAt: z.string(),
});

export const PaginatedRequirementsSchema = z.object({
  items: z.array(RequirementListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type RequirementListItemSchemaType = z.infer<
  typeof RequirementListItemSchema
>;
export type PaginatedRequirementsSchemaType = z.infer<
  typeof PaginatedRequirementsSchema
>;
