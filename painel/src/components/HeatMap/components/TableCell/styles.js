import styled, { css } from 'styled-components';


export const Container = styled.td`
  font-family: 'Roboto';
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(247, 247, 247, 100);
  max-height: 50px;
  > h1 {
    color: ${props => props.percent <= 15 && props.percent > 0 ? '#000' : '#e8e8e8'};
    font-size: 14px;
    ${props => props.defaultCell && css`
      color: #333E44;
    `};
  }
  > p {
    font-size: 12px;
    color: ${props => props.percent <= 15 && props.percent > 0 ? '#333E44' : '#e8e8e8'};
  }
   background-color: ${props => props.backgroundColor};
`;
