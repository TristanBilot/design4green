import React, { Component } from 'react';
import './css/basketPage.scss'
import Cart from './Cart';


class BasketPage extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            basket: props.basket,
            displayGraphMethod: props.displayGraphMethod,
        }
        this.onStartCLickBinded = this.onStartCLick.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            basket: newProps.basket,
        })
    }

    onStartCLick() {
        this.setState(() => {
            this.state.displayGraphMethod()
        })
    }

    basketBtn(props) {
        return <section className="container">
            <div className="checkout">
                <button className="closable" type="button" onClick={this.onStartCLickBinded}>See my planning</button>
            </div>
        </section>
      }
    
    render() {
        return (
            <div id="modal-container" class="dCart">
                <div class="modal-background">
                    <div class="modal">
                        <div className="close_modal_action closable" onClick={this.props.closeCart}><i class="fas fa-times close_modal"></i></div>
                            <Cart id="shopping_cart" basket={this.state.basket}></Cart>
                            { this.basketBtn() }
                    </div>
                </div>
            </div>);
    }
}

export default BasketPage;