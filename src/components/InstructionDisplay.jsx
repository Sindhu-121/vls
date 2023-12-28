import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactTooltip, { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
const InstructionsDisplay = () => {
  const [points, setPoints] = useState([]);
  const { instructionId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [instruction, instructionPoints] = useState([]);

  const validateForm = () => {
    const errors = {};

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/instructionData`
        );
        instructionPoints(response.data.points);
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/instructionpointsGet`
        );
        setPoints(response.data.points);
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId]);

  const handleDelete = async (instructionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3081/deleteinstruction/${instructionId}`
      );
      window.location.reload();
      console.log("Delete Response:", response.data);
      // Add logic to update your component state or perform other actions after deletion
    } catch (error) {
      console.error("Error deleting data:", error.message);
    }
  };

  // const handleDeletePoint = async (instructionId, id) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:3081/deletepoint/${instructionId}/${id}`
  //     );
  //     window.location.reload();

  //     console.log("Delete Point Response:", response.data);
  //     // Add logic to update your component state or perform other actions after deletion
  //   } catch (error) {
  //     console.error("Error deleting point:", error.message);
  //   }
  // };

  return (
    <div className="Instruction_containerTable">
      <h3 className="list_-otsTitels" >
       
        Uploaded Instruction documents
      </h3>
      <table className="otc_-table">
        <thead className="otsGEt_-contantHead otc_-table_-header">
          <tr>
            <th>instruction Id</th>
            <th>examId</th>
            <th>Instructions Heading</th>

            <th>Document Name</th>

            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody className="otc_-table_-tBody"   style={{ textAlign: "center" }}>
          {instruction.map((ite, inde) => (
            <tr
            
              key={inde}
              className={ite.instructionId % 2 === 0 ? "color1" : "color2"}
            >
              <td>{ite.instructionId}</td>
              <td>{ite.examId}</td>
              <td>{ite.instructionHeading}</td>
              <td>{ite.documentName}</td>

              <td>
                
                <div className="tooltip-container  EditDelete_-btns">
                  <Link
                    to={`/Instruction/editIns/${ite.instructionId}`}
                    // title="Open Instruction Points"
                    className="my-anchor-element1 Ots_-edit"
                    data-tooltip-variant="info"
                    data-tooltip-delay-show={1000}
                  >
                   Open
                  </Link>
                  <Tooltip anchorSelect=".my-anchor-element1" place="top">
                    Open Instruction Points
                  </Tooltip>

                  <button
                  className="Ots_-delete my-anchor-element"
                  data-tooltip-variant="warning"
                  data-tooltip-delay-show={1000}
                  onClick={() => handleDelete(ite.instructionId)}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <Tooltip anchorSelect=".my-anchor-element" place="top">
                  Delete
                </Tooltip>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="Instruction_Dis"></div>
    </div>
  );
};

export default InstructionsDisplay;
