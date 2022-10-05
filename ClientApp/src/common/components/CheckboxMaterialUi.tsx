import React, { useState, ChangeEvent } from "react";
import { CheckboxProps } from "../types/Checkbox.types";
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import createTheme from "@material-ui/core/styles/createTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
    overrides: {
      MuiCheckbox: {
        root: {
            padding: '5px',
        },
        colorSecondary: {
          // color: '#E74040',
            '&$checked': {
                // color: 'primary',
            },
        },
    },
    },
    props: {
      MuiCheckbox: {
        color: "primary",
        // style: {backgroundColor:'#4caf50'}
      },
      MuiRadio: {
        color: "primary",
      },
    },
    palette: {
      primary: {
        main: '#4caf50',
      },
      secondary: {
        main: '#432184' ,
      }
  
    },

  });

function CheckboxMaterialUi(props: CheckboxProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [, setValue] = useState(false);


    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        let [error, validClass, elementValue] = ["", "", event.target.checked];

        [error, validClass] = (!elementValue && props.required) ?
            ["Value has to be checked", "is-invalid"] : ["", "is-valid"];


        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    return (
        <MuiThemeProvider theme={theme}>
        <div className="">
            {/* <input
                className={`form-check-input ${props.inputClass ? props.inputClass : ""} ${htmlClass}`}
                type="checkbox"
                id={`id_${props.label}`}
                checked={props.value}
                onChange={onValueChanged} /> */}

<label htmlFor={props.id.toString()}>
                {props.label}
            </label>
            <br />
<Checkbox
        checked={props.value}
        onChange={onValueChanged}
        inputProps={{ 'aria-label': 'primary success', 'id':`id_${props.label}` }}
      />



            {error ?
                <div className="invalid-feedback">
                    {error}
                </div> : null
            }
        </div>
        </MuiThemeProvider>
    );
}

export default CheckboxMaterialUi;