import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function MyComponent() {
  const [numbers, setNumbers] = useState(Array(8).fill('')); 
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event, index) => {
    const newNumbers = [...numbers]; 
    newNumbers[index] = event.target.value; 
    setNumbers(newNumbers); 
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/test', {
        method: 'POST', 
        body: JSON.stringify(numbers), 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const formattedData = responseData.graph1.map((value, index) => ({
        name: index,
        graph1: value,
        graph2: responseData.graph2[index],
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {numbers.map((number, index) => (
        <input
          key={index}
          type="number"
          value={number}
          onChange={event => handleChange(event, index)}
        />
      ))}
      <button onClick={handleSubmit} disabled={isLoading}>
        Run
      </button>
      {data && (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="graph1" stroke="#8884d8" />
          <Line type="monotone" dataKey="graph2" stroke="#82ca9d" />
        </LineChart>
      )}
    </div>
  );
}

export default MyComponent;
