import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { SelectBox } from "@components/SelectBox";

import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";

export const RegisterSyncAndAsyncCalls = () => {

  const {
    name,
    repositoryUrl,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    nextRegistrationStep,
  } = useSystemRegistrationContext();

  const services: string[] = Object.keys(serviceToOpenApiFilename);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
      <SelectBox 
        options={services} 
        onSelectChange={handleSelectChange}>
      </SelectBox>
  )
};