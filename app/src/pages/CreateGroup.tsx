import React, { type ReactElement, useState } from "react";
import Navbar from "../components/Navbar";
import AsyncSubmit from "../components/AsyncSubmit";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";

interface GroupFormValues {
  groupName: string;
  groupDescription: string;
  groupMemberEmail: string;
}

const initialValues: GroupFormValues = {
  groupName: "",
  groupDescription: "",
  groupMemberEmail: "",
};

const CreateGroup = (): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [members, setMembers] = useState<string[]>([]);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    groupName: yup.string().required("Please enter a group name"),
    groupDescription: yup.string().required("Please enter a group description"),
    groupMemberEmail: yup
      .string()
      .email("Invalid email address")
      .test(
        "validate-groupMemberEmail",
        "Please enter an email or add a group member",
        function (value) {
          // Validate only if there's no value and no members added
          return value !== "" || members.length > 0;
        },
      ),
  });

  const handleSubmit = async (values: GroupFormValues, { resetForm }: any) => {
    setIsLoading(true);

    // Construct the group data to send to the backend
    const groupData = {
      groupName: values.groupName,
      groupDescription: values.groupDescription,
      members: members, // Use the members state array
    };

    console.log("Sending group data:", groupData); // Optional: Log the data being sent

    try {
      // Send POST request to the /create-group endpoint
      const response = await api.post("/create-group/:", groupData);

      console.log("Group created successfully:", response.data);
      setSuccess(true); // Set success state to true
      resetForm(); // Reset the form after successful submission
      setMembers([]); // Clear the members array as well
    } catch (error) {
      console.error(
        "Error creating group:",
        (error as any).response?.data || (error as any).message,
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const addMember = (email: string, resetField: () => void) => {
    if (email && !members.includes(email)) {
      setMembers([...members, email]);
      resetField(); // Clear the email input field
    }
  };

  return (
    <>
      <Navbar />
      <div className="FormWidget">
        <div className="FormWidget-body animate__animated animate__slideInDown">
          <div className="Block">
            <div className="Block-header">Create a New Group</div>
            <div className="Block-subtitle">
              Invite group members to split funds.
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
                dirty,
                resetForm,
                setFieldValue,
              }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <Field
                      className="Form-input-box"
                      type="text"
                      id="groupName"
                      name="groupName"
                      placeholder="Trip Group"
                    />
                    {errors.groupName && touched.groupName && (
                      <div className="Form-error">{errors.groupName}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="groupDescription">Group Description</label>
                    <Field
                      className="Form-input-box"
                      type="text"
                      id="groupDescription"
                      name="groupDescription"
                      placeholder="2024 Summer Road Trip"
                    />
                    {errors.groupDescription && touched.groupDescription && (
                      <div className="Form-error">
                        {errors.groupDescription}
                      </div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="groupMemberEmail">
                      Invite Group Members
                    </label>
                    <div className="Flex Flex-row">
                      <Field
                        className="Form-input-box"
                        type="text"
                        id="groupMemberEmail"
                        name="groupMemberEmail"
                        placeholder="johndoe@gmail.com"
                      />
                      <div
                        className="Button Button-color--purple-1000 Margin-left--10"
                        onClick={() => {
                          addMember(values.groupMemberEmail, () =>
                            setFieldValue("groupMemberEmail", ""),
                          );
                        }}
                      >
                        Add
                      </div>
                    </div>
                    {errors.groupMemberEmail && touched.groupMemberEmail && (
                      <div className="Form-error">
                        {errors.groupMemberEmail}
                      </div>
                    )}
                    <div className="Margin-top--10 Text-fontSize--12">
                      {members.map((member, index) => (
                        <span key={index}>
                          {member}
                          {index < members.length - 1 && (
                            <span className="Margin-x--4">•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="Button Button-color--dark-1000 Width--100 Margin-top--10"
                    type="submit"
                    disabled={!isValid || members.length === 0 || isLoading} // Updated condition
                  >
                    {isLoading ? (
                      <AsyncSubmit loading={isLoading} />
                    ) : (
                      "Create Group"
                    )}
                  </button>

                  {success && (
                    <div className="Form-success">
                      Group successfully created
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
