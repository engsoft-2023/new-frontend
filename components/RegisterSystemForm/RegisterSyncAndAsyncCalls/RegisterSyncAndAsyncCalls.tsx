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
    <div>
      <SelectBox
        options={services}
        selectedOption={selectedService}
        onSelectChange={setSelectedService}
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
      <Button loading={loading} onClick={registerOperations}>Finish</Button>
    </div>
  );
};
