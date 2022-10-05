import React, { useState, ChangeEvent } from "react";
import { CheckboxProps } from "../types/Checkbox.types";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
        color: "secondary",
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

function RadioButtonsMaterialUi(props: any): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [, setValue] = useState("");


    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
      let [error, validClass, elementValue] = ["", "", event.target.value];

        [error, validClass] = (!elementValue && props.required) ?
            ["Um valor precisa ser selecionado", "is-invalid"] : ["", "is-valid"];

        console.log(props)
        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    const getOptions: (JSX.Element | null)[] = props.options.map((option: { id: any; name: any; }) => {
      return (
        <FormControlLabel value={`${option.id}`} control={<Radio />} label={`${option.name}`} />
      )
  });

    return (
        <MuiThemeProvider theme={theme}>
        <div className="">
            {/* <input
                className={`form-check-input ${props.inputClass ? props.inputClass : ""} ${htmlClass}`}
                type="checkbox"
                id={`id_${props.label}`}
                checked={props.value}
                onChange={onValueChanged} /> */}

 {props.label !== '' &&<label htmlFor={props.id.toString()}>
                {props.label}
            </label>}
            {/* <br /> */}
{/* <Checkbox
        checked={props.value}
        onChange={onValueChanged}
        inputProps={{ 'aria-label': 'primary success', 'id':`id_${props.label}` }}
      /> */}
          <RadioGroup row   id={`${props.id}`} aria-label="props.label" name="props.label" value={`${props.value}`} onChange={onValueChanged}>
          {getOptions}
        </RadioGroup>



            {error ?
                <div className="invalid-feedback">
                    {error}
                </div> : null
            }
        </div>
        </MuiThemeProvider>
    );
}

export default RadioButtonsMaterialUi;