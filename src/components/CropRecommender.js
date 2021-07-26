import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import api from "../api/recommenderapi"
import Alert from '@material-ui/lab/Alert';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "../styles/croprecommenderoutput.css"
import {cropData} from "./Data"
import Loading from './Loading';





const useStyles = makeStyles({
    root: {
      maxWidth: 550,
    },
    table: {
        minWidth: 450,
    },
});


function CropRecommender() {

    const [formData, setFormData] = useState({
        N:"",
        P:"",
        K:"",
        temperature:"",
        humidity:"",
        ph:"",
        rainfall:""
    })

    const [predictionData, setPredictionData] = useState({})

    const [loadingStatus, setLoadingStatus] = useState(false)

    const handleChange = (e) => {
        let newData = {...formData}
        newData[e.target.id] = e.target.value
        setFormData(newData)
    }

    const validateForm = (formData) => {
        if(formData['humidity'] > 100 || formData['humidity'] < 1){
            alert('Value of humidity must be within 1-100');
            return false;
        } 
        else if(formData['ph'] > 14 || formData['Moisture'] < 0){
            alert('Value of ph must be within 0-14');
            return false;
        }
        else if(formData['N'] > 205 || formData['N'] < 0){
            alert('Value of nitrogen must be within 0-205');
            return false;
        }
        else if(formData['P'] > 205 || formData['P'] < 0){
            alert('Value of phosphorous must be within 0-205');
            return false;
        }
        else if(formData['K'] > 205 || formData['K'] < 0){
            alert('Value of potassium must be within 0-205');
            return false;
        }
        else if(formData['temperature'] > 60 || formData['temperature'] < 10){
            alert('Value of temperature must be within 10-60');
            return false;
        }
        else if(formData['rainfall'] > 300 || formData['rainfall'] < 0){
            alert('Value of rainfall must be within 0-300');
            return false;
        }
        else {
            return true;
        }
    }

    const handleClick = async () => {
        if(validateForm(formData)){
            setLoadingStatus(true)
        
            const request = new FormData()
    
            for(let key in formData) {
                request.append(key, formData[key])
            }
    
            const response = await api.post(
                "/predict_crop",
                request
            )
            
            const responseData = response.data
            setPredictionData(responseData)
            setLoadingStatus(false)
        } else {
            console.log('Wrong input')
        }
        
    }

    const handleBackClick = () => {
        setPredictionData({})
    }

    const classes = useStyles();

    const predictedCrop = cropData[predictionData.final_prediction]


    if(predictionData.final_prediction) {


        const outputComponent = (


            <div className="output_container">
                <Card className={`${classes.root} output_container__card`}>
                    {/* <CardActionArea> */}
                        <CardMedia
                        component="img"
                        alt={predictedCrop.title}
                        height="200"
                        image={predictedCrop.imageUrl}
                        title={predictedCrop.title}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            <b>Prediction: </b>{predictedCrop.title}
                        </Typography>
                        <Typography variant="body3" color="textPrimary" component="p">
                            {predictedCrop.description}
                        </Typography>
                        <br/>

                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell component="th" align="center"><b>Decision Tree Model Prediction</b></TableCell>
                                    <TableCell component="th" align="center"><b>Random Forest Model Prediction</b></TableCell>
                                    <TableCell component="th" align="center"><b>KNN Model Prediction</b></TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">{predictionData.xgb_model_prediction} </TableCell>
                                        <TableCell align="center">{predictionData.rf_model_prediction} </TableCell>
                                        <TableCell align="center">{predictionData.knn_model_prediction} </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        </CardContent>
                    {/* </CardActionArea> */}
                    <CardActions>
                        <Button onClick={()=>handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                        Back to Prediction
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )

        return outputComponent
    }


    else if(loadingStatus) {

        return <Loading />

    }
    else return (
        <div className="animate">
        <div className="form">
            <div className="form__form_group">

                {
                    predictionData.error && 
                    <Alert style={{marginTop:"20px"}} severity="error"> { predictionData.error } </Alert>
                }

                <center><div className="form__title">Crop</div></center>
                <div className="cube">
                    <div className="column">
                        <TextField onChange={(e) => handleChange(e)} value={formData.N} className="form__text_field" id="N" name="N" variant="filled" label="Amount of Nitrogen in Soil" />
                        <TextField onChange={(e) => handleChange(e)} value={formData.P} className="form__text_field" id="P" name="P" variant="filled" label="Amount of Phosphorous in Soil" />
                        <TextField onChange={(e) => handleChange(e)} value={formData.K} className="form__text_field" id="K" name="K" variant="filled" label="Amount of Pottasium in Soil" />
                        <TextField onChange={(e) => handleChange(e)} value={formData.temperature} className="form__text_field" id="temperature" name="temperature" variant="filled" label="Temperature (in Celcius)" />
                    </div>

                    <div className="column">
                        <TextField onChange={(e) => handleChange(e)} value={formData.humidity} className="form__text_field" id="humidity" name="humidity" variant="filled" label="Humidity (in %)" />
                        <TextField onChange={(e) => handleChange(e)} value={formData.ph} className="form__text_field" id="ph" name="ph" variant="filled" label="pH value of Soil" />
                        <TextField onChange={(e) => handleChange(e)} value={formData.rainfall} className="form__text_field" id="rainfall" name="rainfall" variant="filled" label="Rainfall (in mm)" />
                    </div>

                    <Button onClick={()=>handleClick()} className="form__button" color="primary" variant="contained">Predict Crop</Button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default CropRecommender
