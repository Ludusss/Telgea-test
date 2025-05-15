import { RestUsageResponseDto } from '@application/dtos';

/**
 * Interface for REST API client
 */
export interface IRestClient {
  fetchUsageData(userId: string): Promise<RestUsageResponseDto>;
}

/**
 * Implementation of REST client for MVNO provider
 */
export class MvnoRestClient implements IRestClient {
  private readonly baseUrl: string;
  
  /**
   * Constructor
   * @param baseUrl The base URL for the REST API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Fetch usage data for a specific user from the MVNO REST API
   * @param userId The user ID to fetch data for
   * @returns REST response
   */
  public async fetchUsageData(userId: string): Promise<RestUsageResponseDto> {
    try {
      // In a real implementation, this would make an actual REST API call
      // For this assignment, we mock the response
      const mockResponse = this.getMockRestResponse(userId);
      
      // In a real application, we would make an HTTP request like this:
      // const response = await axios.get(`${this.baseUrl}/users/${userId}/usage`);
      // return response.data;
      
      return mockResponse;
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw new Error(`Failed to fetch usage data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Generate mock REST response for testing
   * @param userId User ID to include in the mock response
   * @returns Mock REST response object
   */
  private getMockRestResponse(userId: string): RestUsageResponseDto {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    
    return {
      user_id: userId,
      msisdn: "+46701234567",
      usage: {
        data: {
          total_mb: 845.23,
          roaming_mb: 210.50,
          country: "SE"
        },
        period: {
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString()
        }
      },
      network: {
        type: "4G",
        provider_code: "SE01"
      }
    };
  }
}