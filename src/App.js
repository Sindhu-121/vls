import React from 'react'
import {BrowserRouter as Router ,Routes,Route} from "react-router-dom"
import './App.css';

import Navbar from './Components/Navbar';
import Topic from './Components/Topic';
const App = () => {
  return (
    // <div>App</div>


    <>
    <Router>
    <Routes>
      <Route path='/' element={<Navbar/>}/>
      <Route path='/Topic' element={<Topic/>}/>
    </Routes>
    
    </Router>
    
    </>
  )
}

export default App