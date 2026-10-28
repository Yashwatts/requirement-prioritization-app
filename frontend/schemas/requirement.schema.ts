import { z } from "zod";

export const requirementFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(250, "Name must not exceed 250 characters"),

    requestedBy: z
      .array(z.string())
      .min(1, "Requested by is required"),

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

    isObligatory: z.enum(["Yes", "No"]),

    hasAlternativeSolution: z.enum(["Yes", "No"]),

    impactUsers: z.string().min(1, "Impact users is required"),

    impact: z.union([z.string(), z.number()]).optional(),

    complexityEffort: z.string().min(1, "Complexity and effort is required"),

    clientPriorityOverride: z.string().optional(),

    status: z.string().min(1, "Status is required").default("Registered"),

    startDate: z
      .string()
      .optional()
      .refine(
        (dateString) => !dateString || !isNaN(Date.parse(dateString)),
        "Start date must be a valid date",
      ),

    finishDate: z
      .string()
      .optional()
      .refine(
        (dateString) => !dateString || !isNaN(Date.parse(dateString)),
        "Finish date must be a valid date",
      ),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(500, "Description must not exceed 500 characters"),
  })
  .refine(
    (formValues) => {
      if (formValues.startDate && formValues.finishDate) {
        return new Date(formValues.finishDate) >= new Date(formValues.startDate);
      }
      return true;
    },
    {
      message: "Finish date must be after or equal to start date",
      path: ["finishDate"],
    },
  );

export type RequirementFormValues = z.infer<typeof requirementFormSchema>;
