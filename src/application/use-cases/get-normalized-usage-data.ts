import { IRestClient } from "../../infrastructure/api/rest/mvno-rest-client";
import { RestToInternalMapper } from "@application/mappers/rest-to-internal.mapper";
import { InternalApiFormatDto } from "../dtos";

/**
 * Use case for retrieving and normalizing usage data from the MVNO provider
 */
export class GetNormalizedUsageDataUseCase {
  constructor(
    private readonly restClient: IRestClient,
    private readonly mapper: RestToInternalMapper
  ) {}

  /**
   * Execute the use case
   * @param userId The user ID to fetch data for
   * @returns Normalized usage data in internal format
   */
  public async execute(userId: string): Promise<Partial<InternalApiFormatDto>> {
    try {
      // Fetch raw usage data from REST API
      const usageResponse = await this.restClient.fetchUsageData(userId);

      // Map the response to our internal format
      const normalizedData =
        this.mapper.mapToPartialInternalFormat(usageResponse);

      return normalizedData;
    } catch (error) {
      console.error(
        `Error executing GetNormalizedUsageDataUseCase for user ${userId}:`,
        error
      );
      throw new Error(
        `Failed to get normalized usage data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}