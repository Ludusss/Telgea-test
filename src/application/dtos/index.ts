/**
 * Application DTOs for the MVNO integration
 * These represent data transfer objects used in the application layer
 */

/**
 * DTO for the SOAP SMS charging response
 */
export interface SoapSmsResponseDto {
  "soapenv:Envelope": {
    "soapenv:Body": {
      "sms:ChargeSMS": {
        "sms:UserID": string;
        "sms:PhoneNumber": string;
        "sms:MessageID": string;
        "sms:Timestamp": string;
        "sms:ChargeAmount": string;
        "sms:Currency": string;
      };
    };
  };
}

/**
 * DTO for the REST usage data response
 */
export interface RestUsageResponseDto {
  user_id: string;
  msisdn: string;
  usage: {
    data: {
      total_mb: number;
      roaming_mb: number;
      country: string;
    };
    period: {
      start: string;
      end: string;
    };
  };
  network: {
    type: string;
    provider_code: string;
  };
}

/**
 * DTO for the normalized internal API format
 */
export interface InternalApiFormatDto {
  telgea_user_id: string;
  msisdn: string;
  usage_data: {
    total_mb: number;
    roaming_mb: number;
    country: string;
    network_type: string;
    provider_code: string;
  };
  sms_charges: Array<{
    message_id: string;
    timestamp: string;
    amount: number;
    currency: string;
  }>;
  billing_period: {
    start: string;
    end: string;
  };
}

/**
 * DTO for an SMS charge
 */
export interface SmsChargeDto {
  message_id: string;
  timestamp: string;
  amount: number;
  currency: string;
}

/**
 * DTO for usage data
 */
export interface UsageDataDto {
  total_mb: number;
  roaming_mb: number;
  country: string;
  network_type: string;
  provider_code: string;
}
