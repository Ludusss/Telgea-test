import { InternalApiFormatDto } from "../dtos";
import { NormalizedUserData } from "../../domain/models";

/**
 * Service for aggregating data from different sources into a single normalized format
 */
export class DataAggregationService {
  /**
   * Merges partial internal format objects into a complete internal format
   * This is used to combine data from different API sources (SOAP and REST)
   */
  public mergePartialInternalFormats(
    partialFormats: Partial<InternalApiFormatDto>[]
  ): InternalApiFormatDto {
    // Use Object.assign to merge all partial objects, with later objects overriding earlier ones
    // for properties that are present in multiple objects
    const merged = partialFormats.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {} as InternalApiFormatDto
    );

    // Ensure sms_charges is an array, even if none of the partial formats included it
    if (!merged.sms_charges) {
      merged.sms_charges = [];
    }

    // Ensure each required property exists
    this.validateRequiredProperties(merged);

    return merged;
  }

  /**
   * Converts a domain NormalizedUserData object into the internal API format DTO
   */
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

    // Validate nested properties in usage_data
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

    // Validate nested properties in billing_period
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
