import styled from "styled-components";

export const MultipleSelectBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const InputBox = styled.input`
  background-color: #dedede;
  border: none;
  outline: none;
`;

export const SelectBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
  text-align: center;
  width: 100%;
  margin: 0.5rem 0;
`;

export const AddButtonWrapper = styled.div`
  width: 19%;
  margin-top: 2rem;
  align-self: flex-end;
`;

export const NoItemsParagraph = styled.p`
  margin-top: 0;
`;
