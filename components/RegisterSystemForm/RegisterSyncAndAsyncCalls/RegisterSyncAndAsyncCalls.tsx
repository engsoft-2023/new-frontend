import * as React from "react";
import { ChangeEvent, useState } from "react";
import { SelectBox } from "@components/SelectBox";
import { MultipleSelectBox } from "@components/MultipleSelectBox/MultipleSelectBox";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { Button } from "@components/Button";
import { BoxWrapper } from "./styled";
import { SystemService } from "@services/system";
import { isApiError } from "@common/api";
import { useRouter } from "next/router";

export const RegisterSyncAndAsyncCalls = () => {
  const {
    name,
    repositoryUrl,
    serviceToOpenApiFilename,
    serviceToSynAndAsyncOperations,
    setServiceToOpenApiFilename,
    nextRegistrationStep,
    setServiceToSynAndAsyncOperations,
  } = useSystemRegistrationContext();

  const [loading, setLoading] = useState(false);

  const showMessage = (message: string) => {
    message !== "" && alert(message);
  };

  const router = useRouter();

  console.log(serviceToSynAndAsyncOperations);

  const services: string[] = Object.keys(serviceToOpenApiFilename);

  const [selectedService, setselectedService] = useState<string>(services[0]);

  const handleSelectChange = (option: string) => {
    setselectedService(option);
  };

  const currentServiceOperations =
    serviceToSynAndAsyncOperations[selectedService];
  const currentServiceSync =
    currentServiceOperations["synchronous" as keyof {}];
  const currentServiceAsync =
    currentServiceOperations["asynchronous" as keyof {}];

  const itemsToMatrix = (operations: {}) => {
    const items: string[][] = [];

    Object.keys(operations).forEach((serviceName) => {
      (operations[serviceName as keyof {}] as string[]).forEach((operation) => {
        items.push([serviceName, operation]);
      });
    });

    return items;
  };

  const itemsToDict = (operations: string[][]) => {
    const items: { [key: string]: string[] } = {};

    operations.forEach(([serviceName, operation]) => {
      if (serviceName in items) {
        items[serviceName].push(operation);
      } else {
        items[serviceName] = [operation];
      }
    });

    return items;
  };

  const updateOperations = (
    items: string[][],
    operationType: "sync" | "async"
  ) => {
    const newItems = itemsToDict(items);

    if (operationType === "sync") {
      setServiceToSynAndAsyncOperations(selectedService, {
        synchronous: newItems,
        asynchronous:
          serviceToSynAndAsyncOperations[selectedService][
            "asynchronous" as keyof {}
          ],
      });
    } else {
      setServiceToSynAndAsyncOperations(selectedService, {
        synchronous:
          serviceToSynAndAsyncOperations[selectedService][
            "synchronous" as keyof {}
          ],
        asynchronous: newItems,
      });
    }
  };

  const registerOperations = async () => {
    const response = await SystemService.registerOperations(
      name,
      serviceToSynAndAsyncOperations
    );
    if (isApiError(response)) {
      showMessage(response.error);
    } else {
      showMessage("New system has been successfully registered");
      router.push(`/systems/${name}`);
    }
  };

  return (
    <div>
      <SelectBox
        options={services}
        selectedOption={selectedService}
        onSelectChange={handleSelectChange}
      ></SelectBox>
      <BoxWrapper>
        <MultipleSelectBox
          keyOptions={services}
          items={itemsToMatrix(currentServiceSync)}
          onItemsChange={(items: string[][]) => {
            updateOperations(items, "sync");
          }}
        ></MultipleSelectBox>
        <MultipleSelectBox
          keyOptions={services}
          items={itemsToMatrix(currentServiceAsync)}
          onItemsChange={(items: string[][]) => {
            updateOperations(items, "async");
          }}
        ></MultipleSelectBox>
      </BoxWrapper>
      <Button onClick={registerOperations}>Finish</Button>
    </div>
  );
};
