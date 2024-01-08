import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const UploadedDoc = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3081/documentName");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const [documentData,setDocumentData] = useState([]);
  const handleDelete = async (document_Id) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document ?"
    );
 
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3081/DocumentDelete/${document_Id}`,
          {
            method: "DELETE",
          }
        );
 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
        const result = await response.json();
        console.log(result.message);
        const updatedDocumentData = documentData.filter(
          (item) => item.document_Id !== document_Id
        );
        console.log("Before:", documentData);
        console.log("After:", updatedDocumentData);
        setDocumentData(updatedDocumentData);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };
  return (
    <div className="documentInfo_container">
      <div className="otsTitels" style={{ padding: "0" }}>
    
      </div>
      <div className="documentInfo_contant">
      

        <div>
        <h3 className="list_-otsTitels">uploaded documents list</h3>

          <table className="otc_-table">
            <thead className="otsGEt_-contantHead otc_-table_-header">
              <tr>
                <td>Id</td>
                <td>document name</td>
                <td style={{textAlign:'center'}}>Open document /  delete</td>
              </tr>
            </thead>
            <tbody className="otc_-table_-tBody">
              {data.map((item) => (
                <tr
                  key={item.document_Id}
                
                  className={item.document_Id % 2 === 0 ? "evenRow" : "oddRow"}
                >
                  <td> {item.document_Id}</td>
                  <td>{item.documen_name}</td>
                  <td  >
                    <div className="EditDelete_-btns">
                    <Link className="Ots_-edit " 
                      to={`/getSubjectData/${item.testCreationTableId}/${item.subjectId}/${item.sectionId}`}
                    >
                      Open Document
                    </Link>

                    <button  className="Ots_-delete"   onClick={() => handleDelete(item.document_Id)}><i className="fa-regular fa-trash-can"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
