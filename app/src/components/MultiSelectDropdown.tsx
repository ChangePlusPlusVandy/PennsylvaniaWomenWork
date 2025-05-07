import React, { useState, useRef, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import Icon from "./Icon";

interface TagDropdownProps {
  name: string;
  options: string[];
  selected: string[];
  label: string;
  onChange: (newTags: string[]) => void;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ name, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [field, helpers] = useField<string[]>({ name });
  const { setFieldValue } = useFormikContext();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTag = (tag: string) => {
    const newTags = field.value.includes(tag)
      ? field.value.filter((t) => t !== tag)
      : [...field.value, tag];
    setFieldValue(name, newTags);
  };

  return (
    <div
      className="Form-group"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <div
        className="Button Button-color--blue-1000"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "fit-content" }}
      >
        {label} <Icon glyph="chevron-down" />
      </div>

      {isOpen && (
        <div className="TagDropdown-menu">
          {options.map((tag) => (
            <div
              key={tag}
              className={
                field.value.includes(tag)
                  ? "Badge Badge-color--blue-1000 Margin-bottom--4"
                  : "TagDropdown-item"
              }
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagDropdown;
