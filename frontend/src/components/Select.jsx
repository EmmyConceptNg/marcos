import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
} from "@mui/material";
import PropTypes from "prop-types";
import Text from "./Text";
import { useField } from "formik";
// ... other imports

const SelectField = styled(Select)(({ height }) => ({
  // Styles similar to your InputField, adjusted for Select component
  "& .MuiSelect-select": {
    height: height,
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#667085",
  },
  // ... other styles if needed
}));

export default function SelectInput({
  required = true,
  id,
  label,
  name,
  height = "44px",
  width,
  options = [], // Added an options prop for the dropdown items
  sx,
  // ... other props
}) {
  // Your useState and handlers remain the same if needed for password toggle

  // Your Formik field logic
  const [field, meta] = useField(name);

  return (
    <FormControl fullWidth sx={{ height, ...sx }} variant="outlined">
      {label && (
        <InputLabel id={`${id}-label`}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </InputLabel>
      )}
      <SelectField
        labelId={`${id}-label`}
        id={id}
        label={label}
        fullWidth
        name={name}
        required={required}
        // value={value} // You would control this with Formik `field.value`
        {...field} // Spreads Formik field props into Select
        sx={{ width }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </SelectField>
      {meta.touched && meta.error ? (
        <Text fw="400" color="red" fs="0.75rem">
          {meta.error}
        </Text>
      ) : null}
      {/* You can still include details or helper text if needed */}
    </FormControl>
  );
}

SelectInput.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
  isPin: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  type: PropTypes.string,
  endAdornment: PropTypes.element,
  details: PropTypes.string,
  sx: PropTypes.object,
};
