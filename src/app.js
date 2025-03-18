import express from "express";
import dotenv from "dotenv";

dotenv.config(); 

const PORT = process.env.PORT; 

const app = express(); 
 
app.use("/user", (req, res, next) => {
	console.log("1st Response Handler");
	//res.send("1st Response");
	next();
});

app.use("/user/admin", (req, res) => {
	console.log("2nd Response Handler");
	res.send("2nd Response");
});

app.listen(PORT, () => {
	console.log("Server running on ", PORT);
});