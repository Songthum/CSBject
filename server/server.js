const express = require("express");
const mongoose = require("mongoose");
// const multer = require("multer");
const cors = require("cors");
// const fs = require("fs");

const app = express();


const uri = "mongodb+srv://s6304062636120:sknk2563@cluster0.upocefc.mongodb.net/CSB?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connect to MongoDB");
}).catch((e) => console.log(e));

app.use(express.json());


app.get("/", async (req, res) => {
    res.send("Success yahhhhhh");
});

app.listen(9999, () => {
    console.log('server is running port 9999');
});


app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

// -----------------------------------------------------------------
// EvaluateProject
const scoreSchema = new mongoose.Schema({
    Er_Pname: String,
    Er_CSB01: String,
    Er_CSB02: Number,
    Er_CSB03: Number,
    Er_CSB01_status: String,
    Er_CSB02_status: String,
    Er_CSB03_status: String,
    Er_score: Number,
});


const Scores = mongoose.model("Exam_results", scoreSchema);

app.post("/Exam_results", async (req, res) => {
    try {
      const { Er_Pname, Er_CSB01, Er_CSB02, Er_CSB03, Er_CSB01_status, Er_CSB02_status, Er_CSB03_status, Er_score } = req.body;
      
      // Validate required fields
      if (!Er_Pname || Er_CSB03 === undefined) { // Use undefined for optional fields
        return res.status(400).json({ error: "Required fields missing" });
      }
      
      // Create and save the new score entry
      const scores = new Scores({ Er_Pname, Er_CSB01, Er_CSB02, Er_CSB03, Er_CSB01_status, Er_CSB02_status, Er_CSB03_status, Er_score });
      await scores.save();
      res.status(201).json(scores);
    } catch (err) {
      console.error("Error adding score:", err);
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  });  

  app.post("/Exam_results/:id", async (req, res) => {
    try {
        
    const { id } = req.params;
      const { Er_Pname, Er_CSB01, Er_CSB02, Er_CSB03, Er_CSB01_status, Er_CSB02_status, Er_CSB03_status, Er_score } = req.body;
      
      // Validate required fields
      if (!Er_Pname || Er_CSB03 === undefined) { // Use undefined for optional fields
        return res.status(400).json({ error: "Required fields missing" });
      }
      
      // Create and save the new score entry
      const scores = new Scores({ Er_Pname, Er_CSB01, Er_CSB02, Er_CSB03, Er_CSB01_status, Er_CSB02_status, Er_CSB03_status, Er_score });
      await scores.save();
      res.status(201).json(scores);
    } catch (err) {
      console.error("Error adding score:", err);
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  });  
  
// Get all scores
app.get("/Exam_results", async (req, res) => {
    try {
        const scores = await Scores.find();
        res.json(scores);
    } catch (error) {
        console.error("Error fetching scores:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit a score by id
app.put("/Exam_results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatePayload = req.body;
  
      // Find and update the record
      const updatedScores = await Scores.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true }
      );
  
      if (!updatedScores) {
        return res.status(404).json({ error: "Record not found" });
      }
  
      res.status(200).json(updatedScores);
    } catch (err) {
      console.error("Error updating score:", err);
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  });

// Delete a score by id
app.delete('/Exam_results/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Scores.findByIdAndDelete(id); // Use id here
        res.json({ message: 'Score deleted' });
    } catch (err) {
        console.error("Error deleting score:", err);
        res.status(500).json({ error: err.message });
    }
});


// -----------------------------------------------------------------

// -----------------------------------------------------------------
//CSB01 

const ProjectSchema = new mongoose.Schema({
    P_name: String,
    P_details: String,
    P_status: String,
    P_CSB01: String,
    P_CSB02: String,
    P_CSB03: String,
    P_S1: String,
    P_S2: String,
    P_T: String,
    P_type: String,
    P_tool : String
});

const project = mongoose.model("Project", ProjectSchema);

app.post("/Project", async (req, res) => {
    try {
        const { P_name,P_details,P_status,P_CSB01,P_CSB02,P_CSB03,P_S1,P_S2,P_T,P_type, P_tool } = req.body;
        const Projectna = new project({ P_name,P_details,P_status,P_CSB01,P_CSB02,P_CSB03,P_S1,P_S2,P_T,P_type, P_tool});
        await Projectna.save();
        res.status(201).json(Projectna);
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/Project", async (req, res) => {
    try {
        const projects = await project.find(); // Fetch all projects from the database
        res.status(200).json(projects); // Send the list of projects as a JSON response
    } catch (err) {
        console.error("Error retrieving projects:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Edit
app.put('/Project/:id', async (req, res) => {
    const projectId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedProject = await project.findByIdAndUpdate(
            projectId,
            updatedData,
            { new: true } // Returns the updated document
        );
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update project', error });
    }
});

//Delete
app.delete('/Project/:id', async (req, res) => {
    try {
        await project.findByIdAndDelete(req.params.id);
        res.json({ message: '/Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// -----------------------------------------------------------------

// -----------------------------------------------------------------
//Student

const StudentSchema = new mongoose.Schema({
    S_id: String,
    S_name: String,
    S_email: String,
    S_phone: String,
    S_project: String,
    S_CSB01: String,
    S_CSB02: String,
    S_CSB03: String,
    S_year: String,
    S_match: String,
    S_T_SP1: String,
    S_T_SP2: String

});

const student = mongoose.model("students", StudentSchema);

app.get("/students", async (req, res) => {
    try {
        const Studen = await student.find();
        res.json(Studen);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/students", async (req, res) => {
    try {
        const { S_id,
            S_name,
            S_email,
            S_phone,
            S_project,
            S_CSB01,
            S_CSB02,
            S_CSB03,
            S_year,
            S_match,
            S_T_SP1,
            S_T_SP2 } = req.body;
        const students = new student({ S_id,
            S_name,
            S_email,
            S_phone,
            S_project,
            S_CSB01,
            S_CSB02,
            S_CSB03,
            S_year,
            S_match,
            S_T_SP1,
            S_T_SP2 });
        await students.save();
        res.status(201).json(students);
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).send("Internal Server Error");
    }
});

// -----------------------------------------------------------------
//Teacher

const TeacherSchema = new mongoose.Schema({
    T_id: String,
    T_name: String,
    T_email: String,
    T_phone: String,
    T_position: String,
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
app.get("/Teacher", async (req, res) => {
    try {
        const teacher = await Teacher.find();
        res.json(teacher);
    } catch (err) {
        console.error("Error adding Teachert:", err);
        res.status(500).send("Internal Server Error");
    }
});


// -----------------------------------------------------------------
//Exam
const ExamSchema = new mongoose.Schema({
    Exam_id: String,
    Exam_name: String,
    Exam_room: String,
    Exam_o_CSB01: String,
    Exam_o_CSB02: String,
    Exam_o_CSB03: String,
    Exam_CSB01_status: String,
    Exam_CSB02_status: String,
    Exam_CSB03_status: String,
});

const Exam = mongoose.model("Exam", ExamSchema);

// GET endpoint to fetch exam data
app.get("/Exam", async (req, res) => {
    try {
        const exam = await Exam.find();
        res.json(exam);
    } catch (err) {
        console.error("Error fetching exams:", err);
        res.status(500).send("Internal Server Error");
    }
});

// PUT endpoint to update exam data
app.put("/Exam", async (req, res) => {
    try {
        // Retrieve the data from the request body
        const { Exam_id,Exam_name,Exam_room,Exam_o_CSB01, Exam_o_CSB02, Exam_o_CSB03,Exam_CSB01_status,Exam_CSB02_status,Exam_CSB03_status } = req.body;
        
        // Update or create exam entry
        const exam = await Exam.findOne(); // Find the first document
        if (exam) {
            exam.Exam_o_CSB01 = Exam_o_CSB01;
            exam.Exam_o_CSB02 = Exam_o_CSB02;
            exam.Exam_o_CSB03 = Exam_o_CSB03;
            await exam.save(); // Save the updated document
        } else {
            // If no document found, create a new one
            await Exam.create({
                Exam_o_CSB01,
                Exam_o_CSB02,
                Exam_o_CSB03
            });
        }

        res.status(200).send("Exam data updated successfully");
    } catch (err) {
        console.error("Error updating exam data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/Exam", async (req, res) => {
    try {
        const { Exam_id,Exam_name,Exam_room,Exam_o_CSB01, Exam_o_CSB02, Exam_o_CSB03,Exam_CSB01_status,Exam_CSB02_status,Exam_CSB03_status } = req.body;
        const exam = new Exam({ Exam_id,Exam_name,Exam_room,Exam_o_CSB01, Exam_o_CSB02, Exam_o_CSB03,Exam_CSB01_status,Exam_CSB02_status,Exam_CSB03_status});
        await exam.save();
        res.status(201).json(exam);
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).send("Internal Server Error");
    }
});
