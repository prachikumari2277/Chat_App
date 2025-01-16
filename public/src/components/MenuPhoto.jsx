import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

export default function MenuPhoto({ handleSendMsg }) {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      handleSendMsg(file) 
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  return (
    <StyledMenuBar>
      <div className="menu">
        <div className="part" onClick={openFileSelector}>
          <div className="name">
            <h4>Photos</h4>
          </div>
        </div>
        <div className="part">
          <div className="name">
            <h4>Camera</h4>
          </div>
        </div>
        <div className="part">
          <div className="name" type="button" >
            <h4>Send</h4>
          </div>
        </div>
      </div>
      {fileName && <p className="file-name">Selected file: {fileName}</p>}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </StyledMenuBar>
  );
}

const StyledMenuBar = styled.div`
  position: absolute;
  top: -200px;
  right: -170px;
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

      .name {
        display: flex;
        flex-direction: row;
        color: white;
        margin: 0;
      }
    }
  }

  .file-name {
    margin-top: 1rem;
    color: white;
    font-size: 0.9rem;
    text-align: center;
  }
`;

