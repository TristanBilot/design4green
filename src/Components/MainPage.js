import React, { Component } from 'react';
import './css/mainPage.css'
import './css/basketPage.scss'
import BasketPage from './BasketPage';
import { Link } from "react-router-dom";

class MainPage extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            hasClick: false,
        }
        this.onStartCLickBinded = this.onStartCLick.bind(this)
    }

    async componentWillMount() {
    }

    onStartCLick() {
        this.setState(({
            hasClick: true
        }))
    }
    
    render() {
        return (
            <div>
                <div className={!this.state.hasClick ? "visible" : "hidden"}>
                    <svg id="anim" width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSketch="http://www.bohemiancoding.com/sketch/ns">
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketchType="MSPage">
                            <path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#ffffff" strokeWidth="6" sketchType="MSShapeGroup"></path>
                            <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#ffffff" strokeWidth="6" sketchType="MSShapeGroup"></path>
                            <path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#ffffff" strokeWidth="6" sketchType="MSShapeGroup"></path>
                            <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#ffffff" strokeWidth="6" sketchType="MSShapeGroup"></path>
                            <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#ffffff" strokeWidth="6" sketchType="MSShapeGroup"></path>
                        </g>
                    </svg>
                    <div class="message-box">
                    <h1 style={{textShadow: "1px 1px 2px pink"}}>Eco-designer</h1>
                    <h4 style={{textShadow: "1px 1px 2px pink"}}>Plan eco-designed projects easily</h4>
                    <h5 style={{textShadow: "1px 1px 2px pink"}}>#Design4Green #GreenIT</h5>
                    <div class="buttons-con">
                        <div class="action-link-wrap">
                            <a href="/list"><button id="two" class="link-button button"> Start the tool 🌳</button></a>
                        </div>
                    </div>
                    </div>
                </div>

                {/* <BasketPage id="modal-container"></BasketPage> */}
            </div>
        );
    }
}

export default MainPage;