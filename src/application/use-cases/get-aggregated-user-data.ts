import { ISoapClient } from "../../infrastructure/api/soap/mvno-soap-client";
import { IRestClient } from "../../infrastructure/api/rest/mvno-rest-client";
import { SoapToInternalMapper } from "@application/mappers/soap-to-internal";
import { RestToInternalMapper } from "@application/mappers/rest-to-internal";
import { DataAggregationService } from "../services/data-aggregation";
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
      const [smsResponse, usageResponse] = await Promise.all([
        this.soapClient.fetchSmsChargeData(userId),
        this.restClient.fetchUsageData(userId),
      ]);

      const normalizedSmsData =
        this.soapMapper.mapToPartialInternalFormat(smsResponse);
      const normalizedUsageData =
        this.restMapper.mapToPartialInternalFormat(usageResponse);

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
        `Failed to get aggregated user data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
