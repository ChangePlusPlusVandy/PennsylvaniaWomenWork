import React from "react"
import { Formik, Form, Field } from "formik"
import ParticipantCard from "./ParticipantCard"

interface GenericParticipant {
  _id: string
  first_name: string
  last_name: string
  email: string
  profile_picture_id?: string
}

interface ParticipantGridProps {
  users: GenericParticipant[]
  emptyMessage?: string
}

const handleCardClick = () => {
  console.log("Card clicked")
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  users,
  emptyMessage = "No Users Found",
}) => {
  return (
    <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
      {({ values, setFieldValue }) => {
        const search = values.search.toLowerCase()
        const filtered = users.filter((p) => {
          return (
            p.first_name.toLowerCase().includes(search) ||
            p.last_name.toLowerCase().includes(search) ||
            p.email.toLowerCase().includes(search)
          )
        })

        return (
          <Form>
            <div className="Form-group Margin-bottom--20">
              <Field
                type="text"
                name="search"
                placeholder="Search participants..."
                className="Form-input-box"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("search", e.target.value)
                }
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-muted">{emptyMessage}</p>
            ) : (
              <div className="row gx-3 gy-3">
                {filtered.map((p) => (
                  <div className="col-lg-6" key={p._id}>
                    <ParticipantCard
                      firstName={p.first_name}
                      lastName={p.last_name}
                      email={p.email}
                      profilePictureId={p.profile_picture_id}
                      onClick={() => handleCardClick()}
                    />
                  </div>
                ))}
              </div>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

export default ParticipantGrid
