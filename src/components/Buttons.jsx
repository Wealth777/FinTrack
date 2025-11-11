import React from 'react'

export default function Buttons({funtion}) {

const btnStyle = {
  width: "100px",
  padding: "12px",
  background: "#6c63ff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background 0.3s ease",
};


  return (
    <>
      <button type='button' style={btnStyle}>{funtion}</button>
    </>
  )
}
