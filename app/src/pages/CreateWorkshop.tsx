import React, { useState } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import Navbar from "../components/Navbar"
import * as Yup from "yup"

const CreateWorkshop = () => {
    const initialValues = {
        name: "",
        description: "",
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
    })
    const handleSubmit = (values: any) => {
        console.log(values)
    }
    return (
      <>
        <Navbar />
        <h1>Create Workshop</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form>
                    <div className="Form-group">
                        <label htmlFor="name">Name</label>
                        <Field 
                            type="text" 
                            name="name" 
                            placeholder="Name" 
                            className="Form-input-box"
                        />
                    </div>
                    <div className="Form-group">
                        <label htmlFor="description">Description</label>
                        <Field 
                            type="text" 
                            name="description" 
                            placeholder="Description" 
                            className="Form-input-box"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="Button Button-color--dark-1000 Width--100"
                    >
                        Create Workshop
                    </button>
                </Form>
            )}
        </Formik>
      </>
    )
  }
  
  export default CreateWorkshop