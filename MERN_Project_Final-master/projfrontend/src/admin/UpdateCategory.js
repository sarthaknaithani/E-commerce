import React, {useState, useEffect} from 'react';
import Base from '../core/Base';
import { isAuthenticated } from '../auth/helper';
import { Link } from 'react-router-dom';
import { getCategory, updateCategory } from "./helper/adminapicall"

const UpdateCategory = ({match}) => {

    const [values, setValues] = useState({
        name: "",
        error: false,
        success: false,
        formData: ""
    });

    const {name, error, success, formData} = values

    const {user, token} = isAuthenticated();

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            //console.log(data)
            if(data.error) {
                setValues({...values, error: true})
            } else {
                setValues({
                    ...values,
                    name: data.name,
                })
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId);
    }, [])

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: false, success: false})

        //backend request fired
        console.log(name);
        updateCategory(match.params.categoryId, user._id, token, name)
        .then(data => {
            if(data.error) {
                setValues({...values, error:true})
            } else {
                setValues({
                    ...values,
                    name: "",
                    error: false,
                    success: true
                })
            }
        });
    };

    const handleChange = (event) => {
        setValues({
            ...values,
            error: "",
            name: event.target.value
        })
    }

    const successMessage = () => {
        if(success) {
            return <h4 className="text-success">Category created successfully</h4>
        }
    }

    const warningMessage = () => {
        if(error) {
            return <h4 className="text-danger">Failed to create category</h4>
        }
    }

    const updateCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Enter the category</p>
                <input 
                    type="text"
                    className="form-control my-3"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                    placeholder="For Ex. Summer"
                />
                <button onClick={onSubmit} className="btn btn-outline-info">Create Category</button>
            </div>
        </form>
    );

    return (
        <Base
            title="Update a category here!"
            description="Welcome to category updation section"
            className="container bg-info p-4"
        >
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {updateCategoryForm()}
                </div>
            </div>
        </Base>
    )
}
export default UpdateCategory