import styled from "styled-components";

export const BoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  margin: 2rem 0;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectServiceBox = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

export const FinishButtonWrapper = styled.div`
  width: 10%;
  display: flex;
  align-self: center;
`;
