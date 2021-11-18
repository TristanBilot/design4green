import React, { Component } from 'react';
import './css/basketPage.scss'
import Page from './Cart';


class BasketPage extends Component {

    constructor(props) {
        super(props)
        
        // this.state = {
        //     hasClick: false,
        // }
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
                <div id="modal-container">
                    <div class="modal-background">
                        <div class="modal">
                            <div id="close_modal_action"><i class="fas fa-times close_modal"></i></div>
                                <Page id="shopping_cart"></Page>
                            
                        </div>
                    </div>
                    
                </div>);
                    {/* <div class="content">
                    <h1>Modal Animations</h1>
                    <div class="buttons">
                        <div id="one" class="button">Unfolding</div>
                        <div id="two" class="button">Revealing</div>
                        <div id="three" class="button">Uncovering</div>
                        <div id="four" class="button">Blow Up</div><br />
                        <div id="five" class="button">Meep Meep</div>
                        <div id="six" class="button">Sketch</div>
                        <div id="seven" class="button">Bond</div>
                    </div> */}
                    {/* </div> */}
    }
}

export default BasketPage;