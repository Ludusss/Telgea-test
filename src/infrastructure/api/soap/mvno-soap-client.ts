import * as xml2js from "xml2js";
import { SoapSmsResponseDto } from '@application/dtos';

export interface ISoapClient {
  fetchSmsChargeData(userId: string): Promise<SoapSmsResponseDto>;
}

export class MvnoSoapClient implements ISoapClient {
  private readonly baseUrl: string;
  private readonly parser: xml2js.Parser;

  /**
   * Constructor
   * @param baseUrl The base URL for the SOAP API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });
  }

  /**
   * Fetch SMS charge data for a specific user from the MVNO SOAP API
   * @param userId The user ID to fetch data for
   * @returns Parsed SOAP response
   */
  public async fetchSmsChargeData(userId: string): Promise<SoapSmsResponseDto> {
    try {
      // In a real implementation, this would make an actual SOAP API call
      // For this assignment, we mock the response
      const mockResponse: SoapSmsResponseDto = {
        "soapenv:Envelope": {
          "soapenv:Body": {
            "sms:ChargeSMS": {
              "sms:UserID": userId,
              "sms:PhoneNumber": "+46701234567",
              "sms:MessageID": `msg${Math.floor(Math.random() * 1000)}`,
              "sms:Timestamp": new Date().toISOString(),
              "sms:ChargeAmount": "0.05",
              "sms:Currency": "EUR",
            },
          },
        },
      };

      return mockResponse;
    } catch (error) {
      console.error("Error fetching SMS charge data:", error);
      throw new Error(
        `Failed to fetch SMS charge data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}