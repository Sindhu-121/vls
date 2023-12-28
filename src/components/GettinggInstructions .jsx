// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";

// const API_BASE_URL = "http://localhost:3081";

// const GettinggInstructions = () => {
//   const [points, setPoints] = useState([]);
//   const { instructionId } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/instructionpoints/${instructionId}`
//         );

//         if (response.data.success) {
//           // Assuming the points are fetched correctly, convert them to strings
//           const formattedPoints = response.data.points.map((item) => ({
//             ...item,
//             points: String(item.points),
//           }));

//           setPoints(formattedPoints);
//           console.log("Response:", response.data);
//           console.log("instructionId:", instructionId);
//         } else {
//           console.error("Error in response:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error.message);
//       }
//     };

//     fetchData();
//   }, [instructionId]);

//   const handleDeletePoint = async (instructionId, id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:3081/deletepoint/${instructionId}/${id}`
//       );
//       window.location.reload();

//       console.log("Delete Point Response:", response.data);
//       // Add logic to update your component state or perform other actions after deletion
//     } catch (error) {
//       console.error("Error deleting point:", error.message);
//     }
//   };

//   return (
//     <div className="Instruction_points otsMainPages">
//       <h3 className="list_-otsTitels"> Instruction Points</h3>
      
//       <table className="otc_-table">
//         <thead className="otsGEt_-contantHead otc_-table_-header">
//           <tr>
//             <th>No</th>
//             <th>points</th>
      
//             <th>Edit</th>
//             <th>delete</th>
//           </tr>
//         </thead>
//         <tbody  className="otc_-table_-tBody">
//           {points.map((item, index) => (
//             <tr  key={index}  className={item.id % 2 === 0 ? "color1" : 'color2'}>
//               <td>{item.id}</td>
//               <td>{item.points}</td>
//               <td style={{textAlign:'center'}}>
           
             
//               <Link 
//               className=" Ots_-edit"
//                   to={`/InstructionPage/editIns/${item.instructionId}/${item.id}`}
//                   title="Edit this point"
//                 >
//                   <i className="fa-solid fa-pencil"></i>
//                 </Link>
//               </td>
//               <td style={{textAlign:'center'}}>
//                 <div><button
//                   className="Ots_-delete"
//                   title="delete this point"
//                   onClick={() => handleDeletePoint(item.instructionId, item.id)}
//                 >
//                   <i class="fa-solid fa-trash"></i>
//                 </button></div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GettinggInstructions;

// // import React, { useEffect, useState } from "react";
// // import { Link, useParams } from "react-router-dom";
// // import axios from "axios";

// // const API_BASE_URL = "http://localhost:3081";

// // const GettinggInstructions = () => {
// //   const [points, setPoints] = useState([]);
// //   const [instructionHeading, setInstructionHeading] = useState("");
// //   const { instructionId } = useParams();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${API_BASE_URL}/instructionpoints/${instructionId}`
// //         );

// //         if (response.data.success) {
// //           // Assuming the points are fetched correctly, convert them to strings
// //           const formattedPoints = response.data.points.map((item) => ({
// //             ...item,
// //             points: String(item.points),
// //           }));

// //           setPoints(formattedPoints);

// //           // Check if instructionHeading exists in response.data
// //           if (response.data.instructionHeading) {
// //             setInstructionHeading(response.data.instructionHeading);
// //           }

// //           console.log("Response:", response.data);
// //           console.log("instructionId:", instructionId);
// //         } else {
// //           console.error("Error in response:", response.data.message);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data:", error.message);
// //       }
// //     };

// //     fetchData();
// //   }, [instructionId]);

// //   const handleDeletePoint = async (instructionId, id) => {
// //     try {
// //       const response = await axios.delete(
// //         `http://localhost:3081/deletepoint/${instructionId}/${id}`
// //       );
// //       window.location.reload();

// //       console.log("Delete Point Response:", response.data);
// //       // Add logic to update your component state or perform other actions after deletion
// //     } catch (error) {
// //       console.error("Error deleting point:", error.message);
// //     }
// //   };

// //   return (
// //     <div className="Instruction_points">
// //     <p>{points.instructionHeading}</p>
// //       {points.map((item, index) => (
// //         <div key={index}>
// //           <ul>
// //             <li>{item.points}</li>
// //             <Link
// //               to={`/InstructionPage/editIns/${item.instructionId}/${item.id}`}
// //               title="Edit this point"
// //             >
// //               <i className="fa-solid fa-pencil"></i>
// //             </Link>
// //             <button
// //               className="InstructiondelPoint"
// //               title="delete this point"
// //               onClick={() => handleDeletePoint(item.instructionId, item.id)}
// //             >
// //               <i className="fa-solid fa-trash"></i>
// //             </button>
// //           </ul>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default GettinggInstructions;
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3081";

const GettinggInstructions = () => {
  const { instructionId, id } = useParams();
  const [imageSrc, setImageSrc] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructionData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3081/getInstructionData/${instructionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch instruction data");
        }

        const data = await response.json();
        setImageSrc(`data:image/jpeg;base64,${data.image}`);
        setPoints(data.points);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instruction data:", error);
        setLoading(false);
      }
    };

    fetchInstructionData();
  }, [instructionId]);

  const handleDeletePoint = async (instructionId, id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3081/deletepoint/${instructionId}/${id}`
      );
      window.location.reload();

      console.log("Delete Point Response:", response.data);
      // Add logic to update your component state or perform other actions after deletion
    } catch (error) {
      console.error("Error deleting point:", error.message);
    }
  };

  return (
    <div className="Instruction_points otsMainPages">
      {/* <p>{points.instructionHeading}</p>
      {points.map((item, index) => (
        <div key={index}>
          <ul>
            <li>{item.points}</li>
            <Link
              to={`/InstructionPage/editIns/${item.instructionId}/${item.id}`}
              title="Edit this point"
            >
              <i className="fa-solid fa-pencil"></i>
            </Link>
            <button
              className="InstructiondelPoint"
              title="delete this point"
              onClick={() => handleDeletePoint(item.instructionId, item.id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </ul>
        </div>
      ))} */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <img src={imageSrc} alt="Instruction" />

          {points.map((point) => (
            <ul key={point.instructionId} className={point.id % 2 === 0 ? "color1" : 'color2'}>
              <li >{point.points}</li>

              <Link
                to={`/InstructionPage/editIns/${point.instructionId}/${point.id}`}
                title="Edit this point"
              >
                <i className="fa-solid fa-pencil"></i>
              </Link>
              <button
                className="InstructiondelPoint"
                title="delete this point"
                onClick={() => handleDeletePoint(point.instructionId, point.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default GettinggInstructions;