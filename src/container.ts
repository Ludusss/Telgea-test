import { Container } from "inversify";
import {
  MvnoSoapClient,
  ISoapClient,
} from "./infrastructure/api/soap/mvno-soap-client";
import {
  MvnoRestClient,
  IRestClient,
} from "./infrastructure/api/rest/mvno-rest-client";
import { SoapToInternalMapper } from "@application/mappers/soap-to-internal.mapper";
import { RestToInternalMapper } from "@application/mappers/rest-to-internal.mapper";
import { DataAggregationService } from "@application/services/data-aggregation.service";
import { GetNormalizedUsageDataUseCase } from "@application/use-cases/get-normalized-usage-data.use-case";
import { GetNormalizedSmsDataUseCase } from "@application/use-cases/get-normalized-sms-data.use-case";
import { GetAggregatedUserDataUseCase } from "@application/use-cases/get-aggregated-user-data.use-case";

// Set up InversifyJS container for dependency injection
const container = new Container();

// Register configuration values
container
  .bind<string>("SoapApiBaseUrl")
  .toConstantValue("https://mvno-provider.example.com/soap");
container
  .bind<string>("RestApiBaseUrl")
  .toConstantValue("https://mvno-provider.example.com/api/v1");

// Register infrastructure components
container
  .bind<ISoapClient>("ISoapClient")
  .toDynamicValue((context) => {
    const baseUrl = context.container.get<string>("SoapApiBaseUrl");
    return new MvnoSoapClient(baseUrl);
  })
  .inSingletonScope();

container
  .bind<IRestClient>("IRestClient")
  .toDynamicValue((context) => {
    const baseUrl = context.container.get<string>("RestApiBaseUrl");
    return new MvnoRestClient(baseUrl);
  })
  .inSingletonScope();

// Register application components
container
  .bind<SoapToInternalMapper>(SoapToInternalMapper)
  .toSelf()
  .inSingletonScope();
container
  .bind<RestToInternalMapper>(RestToInternalMapper)
  .toSelf()
  .inSingletonScope();
container
  .bind<DataAggregationService>(DataAggregationService)
  .toSelf()
  .inSingletonScope();

// Register use cases
container
  .bind<GetNormalizedUsageDataUseCase>(GetNormalizedUsageDataUseCase)
  .toDynamicValue((context) => {
    const restClient = context.container.get<IRestClient>("IRestClient");
    const mapper =
      context.container.get<RestToInternalMapper>(RestToInternalMapper);
    return new GetNormalizedUsageDataUseCase(restClient, mapper);
  })
  .inSingletonScope();

container
  .bind<GetNormalizedSmsDataUseCase>(GetNormalizedSmsDataUseCase)
  .toDynamicValue((context) => {
    const soapClient = context.container.get<ISoapClient>("ISoapClient");
    const mapper =
      context.container.get<SoapToInternalMapper>(SoapToInternalMapper);
    return new GetNormalizedSmsDataUseCase(soapClient, mapper);
  })
  .inSingletonScope();

container
  .bind<GetAggregatedUserDataUseCase>(GetAggregatedUserDataUseCase)
  .toDynamicValue((context) => {
    const soapClient = context.container.get<ISoapClient>("ISoapClient");
    const restClient = context.container.get<IRestClient>("IRestClient");
    const soapMapper =
      context.container.get<SoapToInternalMapper>(SoapToInternalMapper);
    const restMapper =
      context.container.get<RestToInternalMapper>(RestToInternalMapper);
    const aggregationService = context.container.get<DataAggregationService>(
      DataAggregationService
    );
    return new GetAggregatedUserDataUseCase(
      soapClient,
      restClient,
      soapMapper,
      restMapper,
      aggregationService
    );
  })
  .inSingletonScope();

export { container };
