import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const PORT = 5000;
app.use(cors({
    origin: "https://travesthetics.vercel.app" 
  }));  
const API_URL = "https://api.geoapify.com/";
const apiKey = process.env.API_KEY; 



//Using Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(express.json());




//Places Categories Retreiving Function
function getChoices(category){
    let choices = ""
    switch (category) {
        case "date":
            choices = "catering,entertainment,leisure,tourism,beach,ski"
            break;
        case "fam":
            choices = "catering,entertainment,leisure,camping,national_park,beach,ski,religion,tourism,pet,commercial,accommodation"
            break;
        case "frnd":
            choices = "catering,entertainment,leisure,tourism,beach,ski,adult,man_made"
            break;            
        case "alone":
            choices = "entertainment,leisure,tourism,beach,ski,adult,man_made,commercial"
            break;
        default:
            console.log("No Matching Category Found")
            break;
    }

    return choices;
}



//Route For Recieving City Name
app.post("/api/findCity", async(req,res)=>{
   const city = req.body["city"]
    console.log(city)

    try {
        const response = await axios.get(API_URL + "v1/geocode/search?"+ "type=city&apiKey="+ apiKey + "&text="+ city)
        const body = {cityNames: response.data.features}
        res.json(body);
    } catch (error) {
        console.log("Failed to Find The Exact City With This Name")
        res.json({cityNames: []})
    }

})

app.post("/api/getrec", async(req,res)=>{
    const category = req.body["category"]   
    const placeId = req.body["placeID"]
    
    try {

        const response = await axios.get(API_URL + "v2/places?"  + "&categories=" + getChoices(category) +  "&filter=place:" + placeId + "&apiKey=" + apiKey + "&limit=20")



    
        // let places = JSON.stringify(response.data.features)
        const body = {result: response.data.features}
        res.json(body)
    } catch (error) {
        console.log("Failed To Get Recommendations");
    }
})






app.listen(PORT, (req,res)=>{
    console.log("Server started at " + PORT);
})
