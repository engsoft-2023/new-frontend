import styled from "styled-components";

export const InputBox = styled.input`
  width: 100%;
  background-color: #dedede;
  border: none;
  outline: none;
  font-size: 1rem;
`;

export const SelectBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  text-align: center;
  width: 100%;
`;

export const AddButtonWrapper = styled.div`
  width: 10%;
  display: flex;
  align-self: flex-end;
`;
