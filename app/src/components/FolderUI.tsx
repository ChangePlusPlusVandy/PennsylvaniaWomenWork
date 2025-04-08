import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import FolderCard from "./FolderCard";
import TagDropdown from "./MultiSelectDropdown";
import { api } from "../api";

interface Folder {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  coverImageS3id?: string;
  tags?: string[];
}

interface Props {
  folders: Folder[];
  allTags: string[];
  imageUrls?: Record<string, string | null>;
}

const FolderUI: React.FC<Props> = ({ folders, allTags, imageUrls }) => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate("/volunteer/workshop-information", { state: { workshopId: id } });
  };

  const [folderImageUrls, setFolderImageUrls] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      const newUrls: Record<string, string | null> = {};

      await Promise.all(
        folders.map(async (folder) => {
          if (folder.coverImageS3id) {
            try {
              const res = await api.get(`/api/resource/getURL/${folder.coverImageS3id}`);
              newUrls[folder.coverImageS3id] = res.data?.signedUrl || null;
            } catch (error) {
              console.error(`Failed to fetch URL for ${folder.coverImageS3id}:`, error);
              newUrls[folder.coverImageS3id] = null;
            }
          }
        })
      );

      setFolderImageUrls(newUrls);
    };

    if (folders.length > 0) {
      fetchImageUrls();
    } else {
      setFolderImageUrls({});
    }
  }, [folders]);

  return (
    <Formik initialValues={{ tags: [], search: "" }} onSubmit={() => {}}>
      {({ values, setFieldValue }) => {
        const filtered = folders.filter((folder) => {
          const matchesTags =
            values.tags.length === 0 ||
            values.tags.some((tag) => folder.tags?.includes(tag));

          const matchesSearch =
            folder.name.toLowerCase().includes(values.search.toLowerCase()) ||
            folder.description
              .toLowerCase()
              .includes(values.search.toLowerCase());

          return matchesTags && matchesSearch;
        });

        return (
          <Form>
            <div className="Flex-row">
              <TagDropdown
                name="tags"
                label="Filter"
                options={allTags}
                selected={values.tags}
                onChange={(tags: string[]) => {
                  setFieldValue("tags", tags);
                }}
              />
              <div className="Form-group">
                <Field
                  type="text"
                  name="search"
                  placeholder="Search folders..."
                  className="Form-input-box"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("search", e.target.value)
                  }
                />
              </div>
            </div>

            {values.tags.length > 0 && (
              <div className="Flex-row Flex-wrap Gap--10 Margin-top--10 Margin-bottom--20">
                {values.tags.map((tag) => (
                  <div
                    key={tag}
                    className="Filter-tag Filter-tag--removable"
                    onClick={() =>
                      setFieldValue(
                        "tags",
                        values.tags.filter((t) => t !== tag),
                      )
                    }
                  >
                    {tag} ✕
                  </div>
                ))}
              </div>
            )}

            <div className="row gx-3 gy-3">
              {filtered.length === 0 ? (
                <div className="col-12 text-center text-muted py-3">
                  No folders match your filters or search.
                </div>
              ) : (
                filtered.map((folder) => (
                  <div className="col-lg-4" key={folder._id}>
                    <FolderCard
                      name={folder.name}
                      description={folder.description}
                      imageUrl={
                        folder.coverImageS3id
                          ? (folderImageUrls?.[folder.coverImageS3id] ?? null)
                          : null
                      }
                      tags={folder.tags}
                      onClick={() => handleClick(folder._id)}
                    />
                  </div>
                ))
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FolderUI;
