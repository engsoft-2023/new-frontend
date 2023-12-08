import React, { ButtonHTMLAttributes } from "react";
import { LoadingSpinner, LoadingSpinnerWrapper, StyledButton } from "./styled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({ loading = false, children, ...rest }: ButtonProps) => {
  return (
    <StyledButton disabled={loading} {...rest}>
      {loading ? (
        <LoadingSpinnerWrapper>
          <LoadingSpinner data-testid="loading-spinner" />
        </LoadingSpinnerWrapper>
      ) : (
        children
      )}
    </StyledButton>
  );
};
