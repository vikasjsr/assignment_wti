const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const PORT = 4000;

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};
app.use(cors(corsOpts));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  const { connection } = await mongoose.connect(
    "mongodb+srv://<username>:<Password>.czdtm.mongodb.net/vichaar"
  );
  console.log(`MongoDB connected with ${connection.host}`);
};

connectDB();

const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }, // Added mobile field
});

const Client = mongoose.model("Client", userSchema);

// Create a user
app.post("/create", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile } = req.body;

    if (!firstName || !lastName || !email || !mobile) {
      return res.status(400).json({
        message: "Parameters are missing",
      });
    }

    const user = await Client.create({
      firstName,
      lastName,
      email,
      mobile,
    });

    res.status(200).json({
      user: user,
      message: "User Created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Read a user
app.get("/getuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Client.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      user: user,
      message: "User Found successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Read all users
app.get("/getalluser", async (req, res) => {
  try {
    const users = await Client.find({});

    if (users.length === 0) {
      return res.status(404).json({
        message: "Users Not Found",
      });
    }

    res.status(200).json({
      users: users,
      message: "Users Found",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a user
app.put("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, mobile } = req.body;

    if (!firstName || !lastName || !email || !mobile) {
      return res.status(400).json({
        message: "Parameters are missing",
      });
    }

    const user = await Client.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        mobile,
      },
      { new: true }
    ); // Set {new: true} to return the updated document

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      user: user,
      message: "User Updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a user
app.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Client.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "User Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
