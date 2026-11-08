import type { MissingRequirement } from "@/types";
import { evaluationMockRouter } from "@/lib/evaluation-mock/mock-router";

export class ApiError extends Error {
  missing?: MissingRequirement[];
  statusCode?: number;

  constructor(
    message: string,
    statusCode?: number,
    missing?: MissingRequirement[],
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.missing = missing;
  }
}

export const apiClientRequest = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  return evaluationMockRouter(url, options);
};
