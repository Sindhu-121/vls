import React, { useEffect, useState } from 'react'

export const DocOtsImg = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          const response = await fetch('http://localhost:3081/api/docGetAllImages');
          const data = await response.json();
          setImages(data);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };
  
      fetchImages();
    }, []);
  return (
    <div>
         <h1>Image Gallery</h1>
      {images.map((imageSet, index) => (
        <div key={index}>
          <h2>Question 1dfsfs{imageSet.question_id}</h2>
          <img src={imageSet.questionImage} alt={`Question ${imageSet.question_id}`} />

          <h3>Options</h3>
          {imageSet.optionImages.map((optionImage, optionIndex) => (
            <img key={optionIndex} src={optionImage} alt={`Option ${optionIndex + 1}`} />
          ))}

          <h3>Solution</h3>
          <img src={imageSet.solutionImage} alt={`Solution ${imageSet.question_id}`} />
        </div>
      ))}
    </div>
  )
}
