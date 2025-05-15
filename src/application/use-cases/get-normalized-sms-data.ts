import { ISoapClient } from "../../infrastructure/api/soap/mvno-soap-client";
import { SoapToInternalMapper } from "../mappers/soap-to-internal";
import { InternalApiFormatDto } from "../dtos";

/**
 * Use case for retrieving and normalizing SMS data from the MVNO provider
 */
export class GetNormalizedSmsDataUseCase {
  constructor(
    private readonly soapClient: ISoapClient,
    private readonly mapper: SoapToInternalMapper
  ) {}

  /**
   * Execute the use case
   * @param userId The user ID to fetch data for
   * @returns Normalized SMS data in internal format
   */
  public async execute(userId: string): Promise<Partial<InternalApiFormatDto>> {
    try {
      // Fetch raw SMS data from SOAP API
      const smsResponse = await this.soapClient.fetchSmsChargeData(userId);

      // Map the response to our internal format
      const normalizedData =
        this.mapper.mapToPartialInternalFormat(smsResponse);

      return normalizedData;
    } catch (error) {
      console.error(
        `Error executing GetNormalizedSmsDataUseCase for user ${userId}:`,
        error
      );
      throw new Error(
        `Failed to get normalized SMS data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
