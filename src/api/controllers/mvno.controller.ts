import { Request, Response } from "express";
import { GetNormalizedUsageDataUseCase } from "../../application/use-cases/get-normalized-usage-data";
import { GetNormalizedSmsDataUseCase } from "../../application/use-cases/get-normalized-sms-data";
import { GetAggregatedUserDataUseCase } from "../../application/use-cases/get-aggregated-user-data";
import { container } from "../../container";

class MvnoController {
  public async getNormalizedUsageData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const useCase = container.resolve(GetNormalizedUsageDataUseCase);
      const result = await useCase.execute(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching normalized usage data:", error);
      res.status(500).json({
        message: "Failed to fetch normalized usage data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async getNormalizedSmsData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const useCase = container.resolve(GetNormalizedSmsDataUseCase);
      const result = await useCase.execute(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching normalized SMS data:", error);
      res.status(500).json({
        message: "Failed to fetch normalized SMS data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async getAggregatedUserData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const useCase = container.resolve(GetAggregatedUserDataUseCase);
      const result = await useCase.execute(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching aggregated user data:", error);
      res.status(500).json({
        message: "Failed to fetch aggregated user data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const mvnoController = new MvnoController();