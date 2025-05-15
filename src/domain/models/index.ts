export class User {
  constructor(
    public readonly telgeaUserId: string,
    public readonly msisdn: string
  ) {}
}

export class BillingPeriod {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}

  public static fromISOStrings(start: string, end: string): BillingPeriod {
    return new BillingPeriod(new Date(start), new Date(end));
  }

  /**
   * Converts the billing period to a plain object representation
   */
  public toPlainObject(): { start: string; end: string } {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString(),
    };
  }
}

export class SmsCharge {
  constructor(
    public readonly messageId: string,
    public readonly timestamp: Date,
    public readonly amount: number,
    public readonly currency: string
  ) {}

  /**
   * Factory method to create an SMS charge from raw data
   */
  public static fromRawData(
    messageId: string,
    timestamp: string,
    amount: number,
    currency: string
  ): SmsCharge {
    return new SmsCharge(messageId, new Date(timestamp), amount, currency);
  }

  /**
   * Converts the SMS charge to a plain object representation
   */
  public toPlainObject(): {
    message_id: string;
    timestamp: string;
    amount: number;
    currency: string;
  } {
    return {
      message_id: this.messageId,
      timestamp: this.timestamp.toISOString(),
      amount: this.amount,
      currency: this.currency,
    };
  }
}

export class UsageData {
  constructor(
    public readonly totalMb: number,
    public readonly roamingMb: number,
    public readonly country: string,
    public readonly networkType: string,
    public readonly providerCode: string
  ) {}

  /**
   * Converts the usage data to a plain object representation
   */
  public toPlainObject(): {
    total_mb: number;
    roaming_mb: number;
    country: string;
    network_type: string;
    provider_code: string;
  } {
    return {
      total_mb: this.totalMb,
      roaming_mb: this.roamingMb,
      country: this.country,
      network_type: this.networkType,
      provider_code: this.providerCode,
    };
  }
}

/**
 * Aggregate root representing normalized user telecom data
 */
export class NormalizedUserData {
  private _smsCharges: SmsCharge[] = [];

  constructor(
    public readonly user: User,
    public readonly usageData: UsageData,
    public readonly billingPeriod: BillingPeriod
  ) {}

  public addSmsCharge(smsCharge: SmsCharge): void {
    this._smsCharges.push(smsCharge);
  }

  public addSmsCharges(smsCharges: SmsCharge[]): void {
    this._smsCharges.push(...smsCharges);
  }

  /**
   * Get all SMS charges for this user
   */
  public get smsCharges(): SmsCharge[] {
    return [...this._smsCharges];
  }

  /**
   * Converts the normalized user data to the expected internal API format
   */
  public toInternalApiFormat(): Record<string, any> {
    return {
      telgea_user_id: this.user.telgeaUserId,
      msisdn: this.user.msisdn,
      usage_data: this.usageData.toPlainObject(),
      sms_charges: this._smsCharges.map((charge) => charge.toPlainObject()),
      billing_period: this.billingPeriod.toPlainObject(),
    };
  }
}
