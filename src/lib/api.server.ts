import { evaluationMockRouter } from "@/lib/evaluation-mock/mock-router";

export const apiServerRequest = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  return evaluationMockRouter(url, options);
};
