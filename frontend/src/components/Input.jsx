import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Text from "./Text";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useField } from "formik";

const InputField = styled(OutlinedInput)(({ theme, isPin, height }) => ({
  "& .MuiOutlinedInput-input": {
    height: height,
    padding: "0 14px",
    borderRadius: "8px",
    border: isPin && "2px solid #FF9D43",
    backgroundColor: "#fff",
    color: isPin ? "#FF9D43" : "#667085",
    fontSize: isPin && "48px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    top: 0,
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(14px, 18px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
  },
}));

export default function Input({
  required = true,
  isPin = false,
  id,
  label,
  placeholder,
  onInput,
  inputProp,
  readOnly = false,
  name,
  height = "44px",
  width,
  type = "text",
  details,
  sx,
  defaultValue,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = (field) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [field, meta] = useField(name);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword[name] ? "text" : type;

  return (
    <FormControl fullWidth sx={{ height }}>
      {label && (
        <label htmlFor={id}>
          <Text fw="500" fs="14px" ml={5} color="#344054">
            {label}
            <span style={{ color: "red", marginLeft: 2 }}>
              {required && "*"}
            </span>
          </Text>
        </label>
      )}
      <InputField
        {...field}
        onInput={onInput}
        readOnly={readOnly}
        inputProp={inputProp}
        height={height}
        type={inputType}
        fullWidth
        sx={{ width, ...sx }}
        name={name}
        required={required}
        id={id}
        isPin={isPin}
        defaultValue={defaultValue}
        endAdornment={
          isPasswordField ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={`toggle ${name} visibility`}
                onClick={() => handleClickShowPassword(name)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword[name] ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        placeholder={placeholder}
      />
      {meta.touched && meta.error ? (
        <Text fw="400" color="red" fs="0.75rem">
          {meta.error}
        </Text>
      ) : null}
      {details && (
        <Text fw="400" fs="14px" ml={5} color="#475467" sx={{ mt: 1 }}>
          {details}
        </Text>
      )}
    </FormControl>
  );
}

Input.propTypes = {
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
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.string,
};
