/**
 * RFC 7807 / RFC 9457 Problem Details object
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}
