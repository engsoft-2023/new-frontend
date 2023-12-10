import { SelectBox } from "@components/SelectBox";
import { Button } from "@components/Button";
import { useState } from "react";
import { InputBox, SelectBoxWrapper } from "./styled";

interface MultipleSelectBoxProps {
  valueType: "select" | "input";
  keyOptions: string[];
}

export const MultipleSelectBox = ({
  valueType,
  keyOptions,
}: MultipleSelectBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const handleSelectChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <SelectBoxWrapper>
        <SelectBox
          options={keyOptions}
          onSelectChange={handleSelectChange}
        ></SelectBox>
        {valueType === "select" ? (
          <SelectBox
            options={keyOptions}
            onSelectChange={handleSelectChange}
          ></SelectBox>
        ) : (
          <InputBox type="text"></InputBox>
        )}
      </SelectBoxWrapper>
      <Button>Add</Button>
    </div>
  );
};
