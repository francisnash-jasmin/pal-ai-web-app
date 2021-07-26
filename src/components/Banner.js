import { Button } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import "../styles/Banner.css"
import Card from '@material-ui/core/Card';

function Banner() {

    let history = useHistory()

    const cropRedirect = () => {
        history.push("/crop")
    }

    const fertRedirect = () => {
        history.push("/fertilizer")
    }
    
    return (
        <div className="banner">
            <div className="output_box"> 
                <Card className={`output_container__box`}>
                <div className="banner__title">
                    <div className="banner__title_head">
                        PAL-AI
                 </div> 
                    <div className="banner__title_tail">
                    <div className="box">A Machine Learning Web Application for Recommending Crop and Fertilizer</div>
                        <div className="banner__buttons">
                            <Button onClick={cropRedirect} className="banner__button cropButton">Crop</Button>
                            <Button onClick={fertRedirect} className="banner__button fertilizerButton">Fertilizer</Button>
                        </div>
                    </div>
                </div>
                </Card>
            </div>
        </div>
    )
}

export default Banner
