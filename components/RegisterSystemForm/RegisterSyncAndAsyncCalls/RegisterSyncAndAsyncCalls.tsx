import * as React from "react";
import { SelectBox } from "@components/SelectBox";
import { MultipleSelectBox } from "@components/MultipleSelectBox/MultipleSelectBox";
import { Button } from "@components/Button";
import {
  BoxWrapper,
  Container,
  FinishButtonWrapper,
  SelectServiceBox,
} from "./styled";
import { useRegisterSyncAndAsyncCalls } from "./hook";

export const RegisterSyncAndAsyncCalls = () => {
  const {
    services,
    selectedService,
    currentServiceSync,
    currentServiceAsync,
    loading,
    setSelectedService,
    itemsToMatrix,
    updateOperations,
    registerOperations,
  } = useRegisterSyncAndAsyncCalls();

  return (
    <Container>
      <SelectServiceBox>
        Choose a service:
        <SelectBox
          options={services}
          selectedOption={selectedService}
          onSelectChange={setSelectedService}
        ></SelectBox>
      </SelectServiceBox>
      <BoxWrapper>
        <div>
          <h3>Sync communications:</h3>
          <MultipleSelectBox
            keyOptions={services}
            placeholder="Ex: GET /orders/{orderId}"
            buttonText="Add new sync"
            items={itemsToMatrix(currentServiceSync)}
            onItemsChange={(items: string[][]) => {
              updateOperations(items, "sync");
            }}
          ></MultipleSelectBox>
        </div>
        <div>
          <h3>Async communications:</h3>
          <MultipleSelectBox
            keyOptions={services}
            placeholder="Ex: ORDER_CREATED"
            buttonText="Add new async"
            items={itemsToMatrix(currentServiceAsync)}
            onItemsChange={(items: string[][]) => {
              updateOperations(items, "async");
            }}
          ></MultipleSelectBox>
        </div>
      </BoxWrapper>
      <FinishButtonWrapper>
        <Button loading={loading} onClick={registerOperations}>
          Finish
        </Button>
      </FinishButtonWrapper>
    </Container>
  );
};
