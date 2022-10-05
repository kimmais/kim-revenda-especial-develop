import React, { useState, ChangeEvent } from "react";
import { NumberInputProps } from "../types/NumberInput.types";

function NumberInput(props: NumberInputProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [, setValue] = useState(0);


    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        let elementValue: number = (isNaN(Number(event.target.value))) ? 0 : Number(event.target.value);
        let [error, validClass] = ["", ""];

        if (!error) {
            [error, validClass] = ((props.max != null) && elementValue > (props.max)) ?
            [`O Valor máximo permitido é ${props.max} `, "is-invalid"] : ["", "is-valid"];
        }

        if (!error) {
            [error, validClass] = ((props.min != null) && elementValue < (props.min)) ?
            [`O Valor mínimo permitido é ${props.min} `, "is-invalid"] : ["", "is-valid"];
        }
        console.log(elementValue)


        const value = props.int ?  Math.trunc(elementValue) : elementValue;

        props.onChange({ value: value, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    return (
        <div>
           {props.label !== '' && <label htmlFor={props.id.toString()}>{props.label}</label>} 
            <input
                value={props.value}
                type="number"
                // step="0"
                min={0}
                // max={999}
                onChange={onValueChanged}
                disabled={props.disabled}
                className={`form-control ${props.inputClass} ${htmlClass}`}
                id={`id_${props.label}`}/>
            {error ?
                <div className="invalid-feedback">
                    {error}
                </div> : null
            }
        </div>
    );
}

export default NumberInput;