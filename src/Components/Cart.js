import React from "react";
import './css/Cart.css';


function _defineProperty(obj, key, value) {
    if (key in obj)
    {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }
    else
    {
        obj[key] = value;
    }
    return obj;
}

function Header(props) {
  return React.createElement("header", {
    className: "container"
  }, React.createElement("h1", null, "Shopping Cart"), React.createElement("ul", {
    className: "breadcrumb"
  }, React.createElement("li", null, "Home"), React.createElement("li", null, "Shopping Cart")), 
);
}

function ProductList(props) {
  return React.createElement("section", {
    className: "container"
  }, React.createElement("ul", {
    className: "products cart-scrollable-list",
    divId: ""
  }, props.products.map((product, index) => {
    let isMandatory = product.mandatory
    return React.createElement("li", {
      className: "row",
      key: index
    }, React.createElement("div", {
      className: "col left centered-div " + (isMandatory ? "isMandatory" : "")
    }, React.createElement("div", {
      className: "detail"
    }, React.createElement("div", {
      className: "name"
    }, React.createElement("a", {
      href: "#"
    }, product.id)), React.createElement("div", {
      className: "description"
    }, product.useCase), React.createElement("div", {
      className: "col right"
    }, React.createElement("div", {
      className: "remove"
    }, React.createElement("div", {
      onClick: props.onRemoveProduct.bind(this, index),
      version: "1.1",
      id: "oula",
      className: "close",
      x: "0px",
      y: "0px",
      viewBox: "0 0 200 200",
      enableBackground: "new 0 0 60 60"
    }, React.createElement("polygon", {
      points: "38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812"
    })))))));
  })));
}

function Summary(props) {
  return React.createElement("section", {
    className: "container"
  },
  React.createElement("div", {
    className: "checkout"
  }, React.createElement("button", {
    type: "button"
  }, "See my planning")));
}

class Cart extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onRemoveProduct", i => {
      const products = this.state.products.filter((product, index) => {
        return index != i;
      });
      this.setState({
        products
      });
    });

    this.state = {
      products: [{
        image: "https://via.placeholder.com/200x150",
        name: "PRODUCT ITEM NUMBER 1",
        description: "Description for product item number 1",
        quantity: 2
      }, {
        image: "https://via.placeholder.com/200x150",
        name: "PRODUCT ITEM NUMBER 2",
        description: "Description for product item number 1",
        quantity: 1
      }],
      tax: 5,
      basket: props.basket,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        basket: newProps.basket,
    })
}

  render() {
    const products = this.state.basket;
    return React.createElement("div", null, React.createElement(Header, {
      products: products
    }), products.length > 0 ? React.createElement("div", null, React.createElement(ProductList, {
      products: products,
      onRemoveProduct: this.onRemoveProduct
    }), React.createElement(Summary, {
      products: products
    })) : React.createElement("div", {
      className: "empty-product"
    }, React.createElement("h3", null, "There are no products in your cart."), React.createElement("button", null, "Shopping now")));
  }

}

//ReactDOM.render( React.createElement(Cart, null), document.getElementById("ShopCart"));

export default Cart;