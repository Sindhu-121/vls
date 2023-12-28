const express = require('express');
// const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3082;
app.use(express.json());
app.use(cors());
const db = require('./db');
const examCreation = require('./otsadmin/examCreation');
const Dashboard = require('./otsadmin/Dashboard')
const OtsCommonapi = require('./otsadmin/OtsCommonapi')


app.use('/OtsCommonapi' , OtsCommonapi)     
app.use('/examCreation' , examCreation )
app.use('/Dashboard' , Dashboard)

   


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });  