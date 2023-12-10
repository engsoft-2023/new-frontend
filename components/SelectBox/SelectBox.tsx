import * as React from 'react';
import { ChangeEvent } from 'react';
import { useState } from 'react';
import { SelectBoxStyle } from './styled';

interface SelectBoxProps {
  options: string[];
  onSelectChange: (option: string) => void;
}

export const SelectBox: React.FC<SelectBoxProps> = ({ options, onSelectChange }) => {

  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value;
    setSelectedOption(event.target.value);
    onSelectChange(option);
  };

  return (
  <div>
    <p>Choose a service:</p>
    <SelectBoxStyle id="selectBox" value={selectedOption} onChange={handleSelectChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </SelectBoxStyle>
  </div>
  );
};
