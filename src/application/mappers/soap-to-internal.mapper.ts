import {
  SoapSmsResponseDto,
  InternalApiFormatDto,
  SmsChargeDto,
} from "../dtos";
import { SmsCharge, User, BillingPeriod } from "../../domain/models";

/**
 * Mapper class to convert SOAP SMS response to the internal API format
 */
export class SoapToInternalMapper {
  /**
   * Maps a SOAP SMS response to an SMS charge object in the internal format
   */
  public mapSmsResponseToSmsCharge(
    soapResponse: SoapSmsResponseDto
  ): SmsCharge {
    const smsData =
      soapResponse["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"];

    return SmsCharge.fromRawData(
      smsData["sms:MessageID"],
      smsData["sms:Timestamp"],
      parseFloat(smsData["sms:ChargeAmount"]),
      smsData["sms:Currency"]
    );
  }

  /**
   * Extract user information from the SOAP response
   */
  public extractUserFromSoapResponse(soapResponse: SoapSmsResponseDto): User {
    const smsData =
      soapResponse["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"];

    return new User(smsData["sms:UserID"], smsData["sms:PhoneNumber"]);
  }

  /**
   * Maps a SOAP SMS response to a partial internal format (just SMS charges)
   * Note: This is a partial mapping and doesn't include usage data or billing period
   */
  public mapToPartialInternalFormat(
    soapResponse: SoapSmsResponseDto
  ): Partial<InternalApiFormatDto> {
    const smsData =
      soapResponse["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"];

    const smsCharge: SmsChargeDto = {
      message_id: smsData["sms:MessageID"],
      timestamp: smsData["sms:Timestamp"],
      amount: parseFloat(smsData["sms:ChargeAmount"]),
      currency: smsData["sms:Currency"],
    };

    return {
      telgea_user_id: smsData["sms:UserID"],
      msisdn: smsData["sms:PhoneNumber"],
      sms_charges: [smsCharge],
    };
  }
}
