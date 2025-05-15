import { InternalApiFormatDto } from "../dtos";
import { NormalizedUserData } from "../../domain/models";

/**
 * Service for aggregating data from different sources into a single normalized format
 */
export class DataAggregationService {
  public mergePartialInternalFormats(
    partialFormats: Partial<InternalApiFormatDto>[]
  ): InternalApiFormatDto {
    const merged = partialFormats.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {} as InternalApiFormatDto
    );

    if (!merged.sms_charges) {
      merged.sms_charges = [];
    }

    this.validateRequiredProperties(merged);

    return merged as InternalApiFormatDto;
  }

  public normalizedUserDataToInternalFormat(
    data: NormalizedUserData
  ): InternalApiFormatDto {
    return data.toInternalApiFormat() as InternalApiFormatDto;
  }

  /**
   * Validates that all required properties are present in the merged object
   * @throws Error if a required property is missing
   */
  private validateRequiredProperties(
    merged: Partial<InternalApiFormatDto>
  ): void {
    const requiredProperties = [
      "telgea_user_id",
      "msisdn",
      "usage_data",
      "billing_period",
    ];

    for (const prop of requiredProperties) {
      if (!merged[prop as keyof InternalApiFormatDto]) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }

    const requiredUsageProps = [
      "total_mb",
      "roaming_mb",
      "country",
      "network_type",
      "provider_code",
    ];

    for (const prop of requiredUsageProps) {
      if (!merged.usage_data?.[prop as keyof typeof merged.usage_data]) {
        throw new Error(`Missing required property in usage_data: ${prop}`);
      }
    }

    const requiredBillingProps = ["start", "end"];

    for (const prop of requiredBillingProps) {
      if (
        !merged.billing_period?.[prop as keyof typeof merged.billing_period]
      ) {
        throw new Error(`Missing required property in billing_period: ${prop}`);
      }
    }
  }
}
