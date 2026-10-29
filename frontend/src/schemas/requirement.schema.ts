import { z } from "zod";

export const requirementFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "required")
      .max(250, "Name must not exceed 250 characters"),

    requestedBy: z.array(z.string()).min(1, "required"),

    requestingInstitution: z.string().min(1, "required"),

    type: z.string().min(1, "required"),

    domain: z.string().min(1, "required"),

    collaboratorDomains: z.array(z.string()).default([]),

    followerDomains: z.array(z.string()).default([]),

    benefitedInstitutions: z.array(z.string()).min(1, "required"),

    studyModalities: z.array(z.string()).min(1, "required"),

    isObligatory: z
      .enum(["Yes", "No", ""])
      .refine((val) => val === "Yes" || val === "No", "required"),

    hasAlternativeSolution: z
      .enum(["Yes", "No", ""])
      .refine((val) => val === "Yes" || val === "No", "required"),

    impactUsers: z
      .union([z.string(), z.number()])
      .refine(
        (value) => value !== "" && value !== undefined,
        "required",
      ),

    impact: z.union([z.string(), z.number()]).optional(),

    complexityEffort: z.string().min(1, "required"),

    clientPriorityOverride: z.string().min(1, "required"),

    status: z.string().min(1, "required").default("Registered"),

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
      .min(1, "required")
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
