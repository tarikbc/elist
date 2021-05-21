import styled from 'styled-components';

export const Container = styled.table`
  font-family: sans-serif;
  width: 100%;
  padding-top: 5rem;
  overflow-x: auto;
  white-space: nowrap;

  tr {
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;

    > th {
      width: 75px;
      height: 50px;
      padding: 14px;
      margin: 0px 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      > p {
        transform: rotate(-90deg);
        padding-left: 10px;
        text-align: left;
        width: inherit;
      }
    }

    > td {
      margin: 4px;
      width: 75px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: normal;
      text-align: center;
      > span {
        font-family: 'Roboto';
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    color: #CCCCCC;
    font-family: 'Roboto';
  }
`
