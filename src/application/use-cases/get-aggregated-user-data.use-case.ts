import { ISoapClient } from "../../infrastructure/api/soap/mvno-soap-client";
import { IRestClient } from "../../infrastructure/api/rest/mvno-rest-client";
import { SoapToInternalMapper } from "@application/mappers/soap-to-internal.mapper";
import { RestToInternalMapper } from "@application/mappers/rest-to-internal.mapper";
import { DataAggregationService } from "../services/data-aggregation.service";
import { InternalApiFormatDto } from "../dtos";

/**
 * Use case for retrieving and aggregating all user data from the MVNO provider
 */
export class GetAggregatedUserDataUseCase {
  constructor(
    private readonly soapClient: ISoapClient,
    private readonly restClient: IRestClient,
    private readonly soapMapper: SoapToInternalMapper,
    private readonly restMapper: RestToInternalMapper,
    private readonly aggregationService: DataAggregationService
  ) {}

  /**
   * Execute the use case
   * @param userId The user ID to fetch data for
   * @returns Complete normalized user data in internal format
   */
  public async execute(userId: string): Promise<InternalApiFormatDto> {
    try {
      // Fetch data from both APIs in parallel
      const [smsResponse, usageResponse] = await Promise.all([
        this.soapClient.fetchSmsChargeData(userId),
        this.restClient.fetchUsageData(userId),
      ]);

      // Map responses to our internal format
      const normalizedSmsData =
        this.soapMapper.mapToPartialInternalFormat(smsResponse);
      const normalizedUsageData =
        this.restMapper.mapToPartialInternalFormat(usageResponse);

      // Combine the partial formats into a complete internal format
      const aggregatedData =
        this.aggregationService.mergePartialInternalFormats([
          normalizedSmsData,
          normalizedUsageData,
        ]);

      return aggregatedData;
    } catch (error) {
      console.error(
        `Error executing GetAggregatedUserDataUseCase for user ${userId}:`,
        error
      );
      throw new Error(
        `Failed to get aggregated user data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
