import styled from "styled-components";

export const BoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8rem;
  margin: 2rem 0;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectServiceBox = styled.div`
  display: flex;
  align-items: center;
  align-self: center;

  & > :first-child {
    margin-left: 1rem;
  }
`;

export const FinishButtonWrapper = styled.div`
  width: 10%;
  display: flex;
  align-self: center;
  margin-top: 2rem;
`;
