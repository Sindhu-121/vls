import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const UpdateInstruction = () => {
  const [points, setPoints] = useState([]);
  const { instructionId, id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/instructionpoints/${instructionId}/${id}`
        );
        setPoints(
          response.data.points.map((item) => ({
            ...item,
            points: String(item.points),
          }))
        );
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
        console.log("id:", id);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId, id]);

  const handleInputChange = (index, newValue) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], points: newValue };
    setPoints(updatedPoints);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3081/updatepoints/${instructionId}/${id}`,
        {
          points: points.map((item) => item.points),
        }
      );
      window.location.reload();
      console.log("Update Response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  return (
    <div className="Instruction_-points_-container otsMainPages">
      <h2 className="otsTitels">Update Instruction point</h2>
      <br />
      {points.map((item, index) => (
        <div key={index} className="Instruction_-points_-content" style={{display:'flex',gap:'1rem'}}>
          <label htmlFor="">{item.id}</label> 
          <input
            type="text"
            value={item.points}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      ))}
      <br />
      <button className="instructionBTN" onClick={handleUpdate}>Update</button>
    </div>
  );
};