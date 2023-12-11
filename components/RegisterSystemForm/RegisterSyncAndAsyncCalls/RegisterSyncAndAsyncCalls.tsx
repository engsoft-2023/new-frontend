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
          Sync communications:
          <MultipleSelectBox
            keyOptions={services}
            items={itemsToMatrix(currentServiceSync)}
            onItemsChange={(items: string[][]) => {
              updateOperations(items, "sync");
            }}
          ></MultipleSelectBox>
        </div>
        <div>
          Async communications:
          <MultipleSelectBox
            keyOptions={services}
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
