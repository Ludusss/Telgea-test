import * as xml2js from "xml2js";
import { SoapSmsResponseDto } from '@application/dtos';

/**
 * Interface for SOAP API client
 */
export interface ISoapClient {
  fetchSmsChargeData(userId: string): Promise<SoapSmsResponseDto>;
}

/**
 * Implementation of SOAP client for MVNO provider
 */
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
      const mockSoapResponse = this.getMockSoapResponse(userId);

      // Parse the XML response
      const parsedResponse = await this.parseXmlResponse(mockSoapResponse);

      return parsedResponse;
    } catch (error) {
      console.error("Error fetching SMS charge data:", error);
      throw new Error(
        `Failed to fetch SMS charge data: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Parse XML response to JavaScript object
   * @param xmlString XML string to parse
   * @returns Parsed object
   */
  private async parseXmlResponse(
    xmlString: string
  ): Promise<SoapSmsResponseDto> {
    try {
      return (await this.parser.parseStringPromise(
        xmlString
      )) as SoapSmsResponseDto;
    } catch (error) {
      throw new Error(
        `Failed to parse XML response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate mock SOAP response for testing
   * @param userId User ID to include in the mock response
   * @returns Mock SOAP XML string
   */
  private getMockSoapResponse(userId: string): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
        <soapenv:Header/>
        <soapenv:Body>
          <sms:ChargeSMS>
            <sms:UserID>${userId}</sms:UserID>
            <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
            <sms:MessageID>msg${Math.floor(Math.random() * 1000)}</sms:MessageID>
            <sms:Timestamp>${new Date().toISOString()}</sms:Timestamp>
            <sms:ChargeAmount>0.05</sms:ChargeAmount>
            <sms:Currency>EUR</sms:Currency>
          </sms:ChargeSMS>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }
}
