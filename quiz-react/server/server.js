const express=require("express");
const app=express();
const port =5000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
const pool= require("./db");

app.post("/getData", async (request, response) => {
    const client = await pool.connect();
    const subject_name = request.body.subject_name;
    try {
        const result = await client.query(`SELECT 
        q.question_id,
        s.subject_name,
        q.question_text,
        q.option_1,
        q.option_2,
        q.option_3,
        q.answer
    FROM 
        questions q
    JOIN
        subjects s
    ON
        q.subject_id = s.subject_id
    
    where s.subject_name=$1`,[subject_name]);

        if(result.rowCount>0){
            response.json({data: result.rows, message: "Data found"});
        }else{
            response.json({data: [], message: "Data not found"});
        }

        
    } catch (e) {
        response.json({
            error:e,
        });
    } finally {
        client.release();
    }
});




app.put("/update",async(request,response)=>{
    const client = await pool.connect();
    const id  =  request.body.id
    const name = request.body.name;
    const age = request.body.age;
    const gender = request.body.gender;
  
    try {
        const res = await client.query(`
        update personal_info
        set name=$1,
        age=$2,
        gender=$3
        where id=$4;`[name, age, gender, id]);
        response.json({data:res.rows, message : 'insert data'});
    } catch (e){
        response.json({ 
            error:e,
        })
    } finally {
        console.log("hii");
        client.release();
    }
});



app.get('/questions/:subjectId', async (req, res) => {
    const { subjectId } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM questions WHERE subject_id = $1', [subjectId]);
        res.json(rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  });



// Route to handle sign-up form submission
app.post("/update-user", async (req, res) => {
  const { password, role } = req.body;

  console.log(req.body);

  try {
    // Update the password and user type for the user with the given email
    const result = await pool.query(
      "UPDATE users SET password = $1, role = $2 WHERE email = $3",
      [password, role, req.body.email]
    );

    res.json({ message: "User password and user type updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user." });
  }
});


  // Route to handle POST request for adding a question
app.post('/api/addQuestion', async (req, res) => {
    const { subject, question, options, answer } = req.body;
  
    if (!subject || !question || !options || !answer || options.length !== 3) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    try {
      const client = await pool.connect();
  
      // Insert question into the database
      const result = await client.query(`
        INSERT INTO questions (question_text, option_1, option_2, option_3, answer, subject_id)
        VALUES ($1, $2, $3, $4, $5, (SELECT subject_id FROM subjects WHERE subject_name = $6))
        RETURNING *
      `, [question, options[0], options[1], options[2], answer, subject]);
  
      client.release();
  
      res.status(201).json({ message: 'Question added successfully', question: result.rows[0] });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Error adding question' });
    }
  });


// Endpoint to handle login verification
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
//  console.log("kdsnlkjeijl");
  try {
    let query;
    if (role === 'client') {
      query = 'SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3';
    } else if (role === 'admin') {
      query = 'SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    const { rowCount, rows } = await pool.query(query, [email, password, role]);

    if (rowCount > 0) {
      if (role === 'client') {
        res.status(200).json({ success: true, message: 'Client login successful', redirect: '/quiz.html' });
      } else if (role === 'admin') {
        res.status(200).json({ success: true, message: 'Admin login successful', redirect: '/admin.html' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Route for inserting user details with OTP into the database
app.post("/send-otp", async (req, res) => {
  try {
    const { username, email, otp } = req.body;
    const result = await pool.query(
      "INSERT INTO users (username, email, otp) VALUES ($1, $2, $3) RETURNING *",
      [username, email, otp]
    );
    res.json({
      success: true,
      message: "User details with OTP inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting user details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error inserting user details" });
  }
});

// Route for validating OTP against the database
app.post("/validate-otp", async (req, res) => {
  try {
    const { email, enteredOTP } = req.body;
    const result = await pool.query("SELECT otp FROM users WHERE email = $1", [
      email,
    ]);
    const storedOTP = result.rows[0]?.otp;

    if (enteredOTP === storedOTP) {
      res.send("OTP validated successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).send("Error validating OTP");
  }
});


// Route to handle updating OTP in the database
app.post('/update-otp', async (req, res) => {
  const { email, newOTP } = req.body;

  try {
    // Update OTP in the database
    const updateQuery = 'UPDATE users SET otp = $1 WHERE email = $2';
    const updateValues = [newOTP, email];
    await pool.query(updateQuery, updateValues);

    res.status(200).send('OTP updated successfully.');
  } catch (error) {
    console.error('Error updating OTP:', error);
    res.status(500).send('Error updating OTP.');
  }
});


// Route to update password for a given email
app.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Update password in the database
    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    const result = await pool.query(updateQuery, [newPassword, email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Route to check if an email exists in the database
app.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    // Query the database to check if the email exists
    const query = 'SELECT COUNT(*) AS count FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    // Extract count from the result
    const count = parseInt(result.rows[0].count);

    // Send response indicating whether the email exists or not
    res.json({ exists: count > 0 });
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.status(500).json({ error: 'Error checking email existence.' });
  }
});


// Route to handle resetting password in the database
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Update password in the database
    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    const updateValues = [newPassword, email];
    await pool.query(updateQuery, updateValues);

    res.status(200).send('Password updated successfully.');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Error resetting password.');
  }
});



app.post("/fetchUser", async (req, res) => {
  // Extract the email from the request body
  const { email } = req.body;
 console.log("bjdbjkwe");
  try {
    // Fetch the username from the database based on the provided email
    const result = await pool.query("SELECT username FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      // Return the username if found
      res.json({ success: true, username: result.rows[0].username });
    } else {
      res.json({ success: false, message: "Username not found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later."});
  }
});




// API endpoint to fetch correct answers based on subject ID
app.get('/correct_answers/:subjectId', async (req, res) => {
  const { subjectId } = req.params;
  console.log("hbeh");
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT answer FROM questions WHERE subject_id = $1', [subjectId]);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching correct answers:', error);
    res.status(500).json({ error: 'An error occurred while fetching correct answers' });
  }
});


// Update a question
app.post('/updateQuestion', async (req, res) => {
  const { question_id, subject_name, question_text, option_1, option_2, option_3, answer } = req.body;

  try {
    // Get subject_id from subject_name (assuming there's a subjects table)
    const subjectQuery = 'SELECT subject_id FROM subjects WHERE subject_name = $1';
    const subjectResult = await pool.query(subjectQuery, [subject_name]);

    if (subjectResult.rowCount === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const subject_id = subjectResult.rows[0].subject_id;

    // Update the question in the database
    const updateQuery = `
      UPDATE questions 
      SET subject_id = $1, question_text = $2, option_1 = $3, option_2 = $4, option_3 = $5, answer = $6 
      WHERE question_id = $7 
      RETURNING *`;
    const values = [subject_id, question_text, option_1, option_2, option_3, answer, question_id];
    const updateResult = await pool.query(updateQuery, values);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port,()=>{
    console.log(`server is running on this port ${port}`);
});