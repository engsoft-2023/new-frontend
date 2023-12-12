import { SelectBox } from "@components/SelectBox";
import { Button } from "@components/Button";
import {
  AddButtonWrapper,
  InputBox,
  MultipleSelectBoxWrapper,
  NoItemsParagraph,
  SelectBoxWrapper,
} from "./styled";

interface MultipleSelectBoxProps {
  keyOptions: string[];
  items: string[][];
  onItemsChange: Function;
  placeholder: string;
  buttonText: string;
}

export const MultipleSelectBox = ({
  keyOptions,
  items,
  onItemsChange,
  placeholder,
  buttonText,
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
    <MultipleSelectBoxWrapper>
      {items.length > 0 ? (
        items.map(([key, value], index) => (
          <SelectBoxWrapper key={key + value + index}>
            <SelectBox
              options={keyOptions}
              selectedOption={key}
              onSelectChange={(option) =>
                handleSelectChange(option, index, value)
              }
            ></SelectBox>
            <InputBox
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) =>
                handleSelectChange(key, index, event.target.value)
              }
            ></InputBox>
          </SelectBoxWrapper>
        ))
      ) : (
        <NoItemsParagraph>No items. Add a new one.</NoItemsParagraph>
      )}
      <AddButtonWrapper>
        <Button onClick={addNewItem}>{buttonText}</Button>
      </AddButtonWrapper>
    </MultipleSelectBoxWrapper>
  );
};
