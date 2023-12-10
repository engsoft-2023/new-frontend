import * as React from "react";
import { ChangeEvent, useState } from "react";
import { SelectBox } from "@components/SelectBox";
import { MultipleSelectBox } from "@components/MultipleSelectBox/MultipleSelectBox";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { Button } from "@components/Button";
import { BoxWrapper } from "./styled";

export const RegisterSyncAndAsyncCalls = () => {
  const {
    name,
    repositoryUrl,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    nextRegistrationStep,
  } = useSystemRegistrationContext();

  const services: string[] = Object.keys(serviceToOpenApiFilename);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <SelectBox
        options={services}
        onSelectChange={handleSelectChange}
      ></SelectBox>
      <BoxWrapper>
      <MultipleSelectBox
        valueType="select"
        keyOptions={["1", "2"]}
      ></MultipleSelectBox>
      <MultipleSelectBox
        valueType="input"
        keyOptions={["1", "2"]}
      ></MultipleSelectBox>
      </BoxWrapper>
    </div>
  );
};
