import { describe, expect, it, jest } from "@jest/globals";
import { RestToInternalMapper } from "../../src/application/mappers/rest-to-internal.mapper";
import { RestUsageResponseDto } from "../../src/application/dtos";

describe("RestToInternalMapper", () => {
  const mapper = new RestToInternalMapper();

  // Mock REST response for testing
  const mockRestResponse: RestUsageResponseDto = {
    user_id: "test123",
    msisdn: "+46701234567",
    usage: {
      data: {
        total_mb: 845.23,
        roaming_mb: 210.50,
        country: "SE"
      },
      period: {
        start: "2025-04-01T00:00:00Z",
        end: "2025-04-30T23:59:59Z"
      }
    },
    network: {
      type: "4G",
      provider_code: "SE01"
    }
  };

  describe("mapResponseToUsageData", () => {
    it("should correctly map REST response to usage data domain object", () => {
      const result = mapper.mapResponseToUsageData(mockRestResponse);

      expect(result.totalMb).toBe(845.23);
      expect(result.roamingMb).toBe(210.50);
      expect(result.country).toBe("SE");
      expect(result.networkType).toBe("4G");
      expect(result.providerCode).toBe("SE01");
    });
  });

  describe("extractBillingPeriodFromResponse", () => {
    it("should correctly extract billing period from REST response", () => {
      const result = mapper.extractBillingPeriodFromResponse(mockRestResponse);

      expect(result.start).toEqual(new Date("2025-04-01T00:00:00Z"));
      expect(result.end).toEqual(new Date("2025-04-30T23:59:59Z"));
    });
  });

  describe("extractUserFromResponse", () => {
    it("should correctly extract user information from REST response", () => {
      const result = mapper.extractUserFromResponse(mockRestResponse);

      expect(result.telgeaUserId).toBe("test123");
      expect(result.msisdn).toBe("+46701234567");
    });
  });

  describe("mapToPartialInternalFormat", () => {
    it("should correctly map REST response to partial internal format", () => {
      const result = mapper.mapToPartialInternalFormat(mockRestResponse);

      expect(result.telgea_user_id).toBe("test123");
      expect(result.msisdn).toBe("+46701234567");
      expect(result.usage_data).toEqual({
        total_mb: 845.23,
        roaming_mb: 210.50,
        country: "SE",
        network_type: "4G",
        provider_code: "SE01"
      });
      expect(result.billing_period).toEqual({
        start: "2025-04-01T00:00:00Z",
        end: "2025-04-30T23:59:59Z"
      });
    });
  });
});