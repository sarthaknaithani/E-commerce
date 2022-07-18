import React, {useState, useEffect} from 'react';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';

const StripeCheckout = ({products, setReload = f => f. reload = undefined}) => {
    
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
        })
        return amount;
    }

    const makePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response);
            //call further methods
            //const {status}  = response;
            //console.log("STATUS: ", status);
        }).catch(error => console.log(error))
    };

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                stripeKey="pk_test_51HAeO1BegPTov1TrDLOyf8Ltx1R7qVZJesDt3y41hESBTHdC97oAMuNpd9o8gfxDFVdQXF8B80a9s6wsQmlh7Z2w00XchjKw3t"
                token={makePayment}
                amount={getFinalAmount() * 100}
                name="Buy Tshirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with stripe</button>
            </StripeCheckoutButton>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">
                    Signin
                </button>
            </Link>
        )
    }
    
    return (
        <div>
            <h3 className="text-white">Stripe checkout {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckout