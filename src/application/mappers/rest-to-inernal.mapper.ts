import {
  RestUsageResponseDto,
  InternalApiFormatDto,
  UsageDataDto,
} from "../dtos";
import { User, UsageData, BillingPeriod } from "../../domain/models";

/**
 * Mapper class to convert REST usage response to the internal API format
 */
export class RestToInternalMapper {
  /**
   * Maps REST usage response to usage data domain object
   */
  public mapResponseToUsageData(restResponse: RestUsageResponseDto): UsageData {
    return new UsageData(
      restResponse.usage.data.total_mb,
      restResponse.usage.data.roaming_mb,
      restResponse.usage.data.country,
      restResponse.network.type,
      restResponse.network.provider_code
    );
  }

  /**
   * Extract billing period from REST response
   */
  public extractBillingPeriodFromResponse(
    restResponse: RestUsageResponseDto
  ): BillingPeriod {
    return BillingPeriod.fromISOStrings(
      restResponse.usage.period.start,
      restResponse.usage.period.end
    );
  }

  /**
   * Extract user information from REST response
   */
  public extractUserFromResponse(restResponse: RestUsageResponseDto): User {
    return new User(restResponse.user_id, restResponse.msisdn);
  }

  /**
   * Maps a REST usage response to a partial internal format (just usage data and billing period)
   * Note: This is a partial mapping and doesn't include SMS charges
   */
  public mapToPartialInternalFormat(
    restResponse: RestUsageResponseDto
  ): Partial<InternalApiFormatDto> {
    const usageData: UsageDataDto = {
      total_mb: restResponse.usage.data.total_mb,
      roaming_mb: restResponse.usage.data.roaming_mb,
      country: restResponse.usage.data.country,
      network_type: restResponse.network.type,
      provider_code: restResponse.network.provider_code,
    };

    return {
      telgea_user_id: restResponse.user_id,
      msisdn: restResponse.msisdn,
      usage_data: usageData,
      billing_period: {
        start: restResponse.usage.period.start,
        end: restResponse.usage.period.end,
      },
    };
  }
}
