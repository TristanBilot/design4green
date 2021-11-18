import React, { Component } from 'react';
import './css/basketPage.scss'
import Cart from './Cart';


class BasketPage extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            basket: props.basket,
        }
        this.onStartCLickBinded = this.onStartCLick.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            basket: newProps.basket,
        })
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
                            <Cart id="shopping_cart" basket={this.state.basket}></Cart>
                    </div>
                </div>
            </div>);
    }
}

export default BasketPage;