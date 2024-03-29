import { FormControl, IconButton, InputAdornment, OutlinedInput, styled } from "@mui/material";
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
    border: isPin && "2px solid #FF9D43" ,
    backgroundColor: "#fff",
    color: isPin ? "#FF9D43" : "#667085",
    fontSize : isPin && '48px' 
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
  required = true, isPin=false,
  id,
  label,
  value,
  placeholder, onInput, inputProp,
  onChange,
  name, height="44px",
  width, type="text", endAdornment,  details,
  sx,
}) {

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

   const [field, meta] = useField(name);

  return (
    <FormControl fullWidth sx={{ height }}>
      {label && (
        <label htmlFor="password">
          <Text fw="500" fs="14px" ml={5} color="#344054">
            {label}
            <span style={{ color: "red", marginLeft: 2 }}>
              {required && "*"}
            </span>
          </Text>
        </label>
      )}
      <InputField
        {...field} onInput={onInput} inputProp={inputProp}
        height={height}
        type={
          endAdornment && showPassword
            ? "text"
            : endAdornment && !showPassword
              ? "password"
              : type
        }
        fullWidth
        sx={{ width, ...sx }}
        name={name}
        // onChange={onChange}
        required={required}
        id={id}
        isPin={isPin}
        endAdornment={
          endAdornment && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
        // value={value}
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
  value: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  type: PropTypes.string,
  endAdornment: PropTypes.element,
  details: PropTypes.string,
  onChange: PropTypes.func,
  sx: PropTypes.object,
};
