import { useState } from "react";
import { SystemService } from "@services/system";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { useRouter } from "next/router";
import { ApiError, isApiError } from "@common/api";


export const useRegisterSyncAndAsyncCalls = () => {
  const {
    name,
    serviceToSynAndAsyncOperations,
    setServiceToSynAndAsyncOperations,
  } = useSystemRegistrationContext();

  const services: string[] = Object.keys(serviceToSynAndAsyncOperations);

  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>(services[0]);

  const router = useRouter();

  const currentServiceOperations =
    serviceToSynAndAsyncOperations[selectedService];
  const currentServiceSync =
    currentServiceOperations["synchronous" as keyof {}];
  const currentServiceAsync =
    currentServiceOperations["asynchronous" as keyof {}];

  const showMessage = (message: string) => {
    message !== "" && alert(message);
  };

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
    setLoading(true);
    const response = await SystemService.registerOperations(
      name,
      serviceToSynAndAsyncOperations
    );
    setLoading(false);
    if (isApiError(response)) {
      showMessage((response as ApiError).error);
    } else {
      showMessage("New system has been successfully registered");
      router.push(`/systems/${name}`);
    }
  };

  return {
    services,
    selectedService,
    currentServiceSync,
    currentServiceAsync,
    loading,
    setSelectedService,
    itemsToMatrix,
    updateOperations,
    registerOperations,
  };
};
