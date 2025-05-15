import { describe, expect, it, jest } from "@jest/globals";
import { SoapToInternalMapper } from "../../src/application/mappers/soap-to-internal.mapper";
import { SoapSmsResponseDto } from "../../src/application/dtos";

describe("SoapToInternalMapper", () => {
  const mapper = new SoapToInternalMapper();

  // Mock SOAP response for testing
  const mockSoapResponse: SoapSmsResponseDto = {
    "soapenv:Envelope": {
      "soapenv:Body": {
        "sms:ChargeSMS": {
          "sms:UserID": "test123",
          "sms:PhoneNumber": "+46701234567",
          "sms:MessageID": "msg456",
          "sms:Timestamp": "2025-04-01T12:30:00Z",
          "sms:ChargeAmount": "0.05",
          "sms:Currency": "EUR",
        },
      },
    },
  };

  describe("mapSmsResponseToSmsCharge", () => {
    it("should correctly map SOAP response to SMS charge domain object", () => {
      const result = mapper.mapSmsResponseToSmsCharge(mockSoapResponse);

      expect(result.messageId).toBe("msg456");
      expect(result.timestamp).toEqual(new Date("2025-04-01T12:30:00Z"));
      expect(result.amount).toBe(0.05);
      expect(result.currency).toBe("EUR");
    });
  });

  describe("extractUserFromSoapResponse", () => {
    it("should correctly extract user information from SOAP response", () => {
      const result = mapper.extractUserFromSoapResponse(mockSoapResponse);

      expect(result.telgeaUserId).toBe("test123");
      expect(result.msisdn).toBe("+46701234567");
    });
  });

  describe("mapToPartialInternalFormat", () => {
    it("should correctly map SOAP response to partial internal format", () => {
      const result = mapper.mapToPartialInternalFormat(mockSoapResponse);

      expect(result.telgea_user_id).toBe("test123");
      expect(result.msisdn).toBe("+46701234567");
      expect(result.sms_charges).toHaveLength(1);
      expect(result.sms_charges![0].message_id).toBe("msg456");
      expect(result.sms_charges![0].timestamp).toBe("2025-04-01T12:30:00Z");
      expect(result.sms_charges![0].amount).toBe(0.05);
      expect(result.sms_charges![0].currency).toBe("EUR");
    });
  });
});
