import { SelectBox } from "@components/SelectBox";
import { Button } from "@components/Button";
import { useState } from "react";
import { InputBox, SelectBoxWrapper } from "./styled";

interface MultipleSelectBoxProps {
  keyOptions: string[];
  items: string[][];
  onItemsChange: Function;
}

export const MultipleSelectBox = ({
  keyOptions,
  items,
  onItemsChange,
}: MultipleSelectBoxProps) => {
  const handleSelectChange = (option: string, index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = [option, value];
    onItemsChange(newItems);
  };

  const addNewItem = () => {
    const newItems = [...items];
    newItems.push([keyOptions[0], ""]);
    onItemsChange(newItems);
  };

  return (
    <div>
      {items.map(([key, value], index) => (
        <SelectBoxWrapper key={key+value+index}>
          <SelectBox
            options={keyOptions}
            selectedOption={key}
            onSelectChange={(option) =>
              handleSelectChange(option, index, value)
            }
          ></SelectBox>
          <InputBox
            type="text"
            value={value}
            onChange={(event) =>
              handleSelectChange(key, index, event.target.value)
            }
          ></InputBox>
        </SelectBoxWrapper>
      ))}
      <Button onClick={addNewItem}>Add</Button>
    </div>
  );
};
