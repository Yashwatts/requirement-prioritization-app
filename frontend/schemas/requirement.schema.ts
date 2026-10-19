import { z } from "zod";

// ============================================================
// Zod schemas mirroring backend API response shape
// Used for runtime validation of GET /api/requirements responses
// ============================================================

export const RequirementListItemSchema = z.object({
  id: z.string().uuid(),
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

export type RequirementListItemSchema = z.infer<
  typeof RequirementListItemSchema
>;
export type PaginatedRequirementsSchema = z.infer<
  typeof PaginatedRequirementsSchema
>;
