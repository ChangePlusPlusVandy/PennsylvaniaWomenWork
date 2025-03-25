import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import Navbar from "../components/Navbar";
import AsyncSubmit from "../components/AsyncSubmit";
import { api } from "../api";

const initialValues = {
  name: "",
  email: "",
  verifyEmail: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  verifyEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Emails must match")
    .required("Please verify email"),
});

const SampleMenteeInvite = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    console.log("Submitting email invite", values);
    setIsLoading(true);
    try {
      const response = await api.post("/user/send-email", {
        name: values.name,
        email: values.email,
        role: "mentee",
      });

      if (response.status === 200) {
        toast.success("Invite sent successfully!", {
          duration: 2000,
          position: "top-center",
        });
        resetForm();
      } else {
        throw new Error("Failed to send invite");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Failed to send invite", {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Block Width--70 Margin-right--80 Margin-left--80 Margin-top--40">
        <div
          className="Flex-row Margin-bottom--40 Margin-left--40 Margin-right--100 Margin-top--30 Text-color--teal-1000 Text-fontSize--30"
          style={{
            borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
            paddingBottom: "10px",
          }}
        >
          Invite Mentee
        </div>
        <div className="Margin-left--40 Margin-right--40">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="Margin-bottom--30">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div>Name:</div>
                    </div>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter mentee name"
                      className="Form-input-box"
                      autoComplete="name"
                    />
                    {errors.name && touched.name && (
                      <div className="Form-error">{errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="Margin-bottom--30">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div>Email Address:</div>
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      className="Form-input-box"
                      autoComplete="email"
                    />
                    {errors.email && touched.email && (
                      <div className="Form-error">{errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="Margin-bottom--30">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div>Verify Email Address:</div>
                    </div>
                    <Field
                      type="email"
                      name="verifyEmail"
                      placeholder="Verify email address"
                      className="Form-input-box"
                      autoComplete="email"
                    />
                    {errors.verifyEmail && touched.verifyEmail && (
                      <div className="Form-error">{errors.verifyEmail}</div>
                    )}
                  </div>
                </div>

                <div className="Flex-row Justify-content--center Margin-top--30">
                  <button
                    type="submit"
                    className="Button Button-color--teal-1000 Width--50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isLoading} />
                    ) : (
                      <div className="Flex-row Align-items--center Justify-content--center">
                        <span>Send Invite</span>
                      </div>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SampleMenteeInvite;
