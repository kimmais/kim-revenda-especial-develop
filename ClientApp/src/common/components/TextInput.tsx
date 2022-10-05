import React, { useState, ChangeEvent } from "react";
import { TextInputProps } from "../types/TextInput.types";

function TextInput(props: TextInputProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [, setValue] = useState("");


    function validateEmail(email:string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }



    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        let [error, validClass, elementValue] = ["", "", event.target.value];

        [error, validClass] = (!elementValue && props.required) ?
            ["Valor não pode ser vazio", "is-invalid"] : ["", "is-valid"];

        if (!error) {
            [error, validClass] = (props.maxLength && elementValue && elementValue.length > (props.maxLength)) ?
            [`A quantidade máxima de letras é ${props.maxLength}`, "is-invalid"] : ["", "is-valid"];

            if (!error) {
            [error, validClass] = (props.minlength && elementValue && elementValue.length < (props.minlength)) ?
            [`A quantidade mínima de letras é ${props.minlength}`, "is-invalid"] : ["", "is-valid"];
            }

            if(props.type === "email"){
                [error, validClass] = !validateEmail(props.value) ?
                [`Este email não é valido`, "is-invalid"] : ["", "is-valid"];
            }
        }

        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    return (
        <div>
            {props.label !== '' && <label htmlFor={`${props.id}`}>{props.label}</label>}
            <input
                {...props}
                value={props.value}
                type={props.type}
                onChange={onValueChanged}
                className={`form-control ${props.inputClass} ${htmlClass}`}
                id={`${props.id?props.id : 'id_'+props.label }`}
                disabled={props.disabled}
                // placeholder={props.placeholder} 
                />
            {error ?
                <div className="invalid-feedback">
                    {error}
                </div> : null
            }
        </div>
    );
}

export default TextInput;