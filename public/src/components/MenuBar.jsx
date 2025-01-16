
import styled from "styled-components";

import { BiCaretRight } from "react-icons/bi";


export default function MenuBar({ toggleMenu, handleClearMessages }) {
    return (
      <StyledMenuBar>
        <div className="menu">
          <div className="part" onClick={handleClearMessages}>
            <div className="name">
              <h4>Clear Chat</h4>
            </div>
          </div>
          <div className="part" >
            <div className="name">
              <h4>Block</h4>
            </div>
          </div>
          <div className="part">
            <div className="name">
              <h4>More</h4>
              <BiCaretRight />
            </div>
          </div>
        </div>
      </StyledMenuBar>
    );
  }
  
  const StyledMenuBar = styled.div`
    position: absolute;
    top: 120%;
    right: 0;
    background-color: #080420;
    border: 1px solid #9a86f3;
    box-shadow: 0 5px 10px #9a86f3;
    border-radius: 0.5rem;
    padding: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: 200px;
  
    .menu {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
  
      .part {
        background-color: #ffffff15;
        padding: 0.5rem;
        border-radius: 0.3rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
  
        &:hover {
          background-color: #9a86f3;
        }
  
        .name  {
          display: flex;
          flex-direction: row;
          color: white;
          margin: 0;
        }
      }
    }
  `;

