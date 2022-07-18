import {API} from "../../backend"

export const signup = user => {
    return fetch(`${API}/signup`, { //this is a fetch request
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
};

export const signin = user => {
    return fetch(`${API}/signin`, { //this is a fetch request
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
};

export const authenticate = (data, next) => {
    if(typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data)) //sets the token into the user browser
        next();
    }
}


export const signout = next => {
    if(typeof window !== "undefined") {
        localStorage.removeItem("jwt")
        next();

        return fetch(`${API}/signout`, {
            method: "GET"
        })
        .then(response => console.log("signout success"))
        .catch(err => console.log(err));
    }
};

export const isAuthenticated = () => { //checking authentication of user
    if(typeof window == "undefined") { //means we don't have access to window oject
        return false;
    }
    if(localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
}