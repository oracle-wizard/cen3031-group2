import React, { useEffect, useState } from 'react';
import Button from "./components/Button.tsx";
import NavBar from "./components/NavBar.tsx";
import DropDown from "./components/DropDown.tsx";
import "./App.css";

function App() {
  const [data, setData] = useState<string[]>([]); // State to hold the table names

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:3000/api/data')
      .then(response => response.json())
      .then(data => {
        // Map each item to extract the table name
        const tableNames = data.map((item: { TABLE_NAME: string }) => item.TABLE_NAME);
        setData(tableNames); // Set the extracted names in state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <Button />
      <DropDown />

      <h1>Database Tables</h1>
      <ul>
        {data.map((tableName, index) => (
          <li key={index}>{tableName}</li> // Display each table name
        ))}
      </ul>
    </>
  );
}

export default App;
