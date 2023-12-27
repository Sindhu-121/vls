import React from 'react'

const Topic = () => {
    const topics = [
        'Sets, Relations, and Functions',
        'Complex Numbers',
        'Matrices and Determinants',
        'Permutations and Combinations',
        'Mathematical Induction',
        'Binomial Theorem and Its Simple Applications',
        'Sequences and Series',
        'Limit, Continuity, and Differentiability',
        'Integral Calculus',
        'Differential Equations',
        'Coordinate Geometry',
        'Three Dimensional Geometry',
        'Vector Algebra',
        'Statistics and Probability',
      ];
  return (
    <div>
<ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  )
}

export default Topic