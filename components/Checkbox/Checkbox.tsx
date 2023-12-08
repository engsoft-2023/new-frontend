import React, { InputHTMLAttributes } from "react";
import { CheckboxInput, CheckboxLabel, Checkmark } from "./styled";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Checkbox = ({ name, ...rest }: CheckboxProps) => {
  return (
    <CheckboxLabel>
      {name}
      <CheckboxInput type="checkbox" {...rest} />
      <Checkmark />
    </CheckboxLabel>
  );
};
