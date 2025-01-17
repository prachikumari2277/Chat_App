import React from "react";
import { BiDotsVertical } from "react-icons/bi";
import styled from "styled-components";

export default function Vertical({ toggleMenu }) {
  return (
    <Button onClick={toggleMenu}>
      <BiDotsVertical />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
  &:hover {
    background-color: #7c6bd4;
  }
`;
