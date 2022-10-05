import React, {Fragment, useState} from "react";
// import styled from '../../../config/styled';
import RichTextEditor from 'react-rte';


export const RichText = (props) => {

    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");

    const [value, setValue] = React.useState(() =>
        !props.value || props.value?.length === 0
            ? RichTextEditor.createEmptyValue()
            : RichTextEditor.createValueFromString(props.value, 'html'),
    );
    const [count, setCount] = React.useState(props.value ? value.toString('html').length : 0);

    const onChange = (editorvalue) => {
        const text = editorvalue.toString('html');
        setCount(text.length);
        if ((props.maxChar && text.length <= props.maxChar) || !props.maxChar) {
            setValue(editorvalue);
            if (props.onChange) {
                props.onChange(props.field,text);
            }
        } else {
            setValue(value);
        }
    };

    React.useEffect(() => {
        if (props.maxChar && count > props.maxChar) {
            setValue(value);
        }
    }, [count]);

    function onValueChanged(value) {
        let [error, validClass, elementValue] = ["", "", value];

        [error, validClass] = (!elementValue && props.required) ?
            ["Value cannot be empty", "is-invalid"] : ["", "is-valid"];

        if (!error) {
            [error, validClass] = (props.maxLength && elementValue && elementValue.length > (props.maxLength)) ?
            [`Value can't have more than ${props.maxLength} characters`, "is-invalid"] : ["", "is-valid"];
        }

        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    // props.onChange({ field: props.field });

    return (
        <Fragment>
        <label>{props.label || ''}</label>
            <RichTextEditor
                editorClassName={'textarea'}
                className={'editor'}
                value={value}
                onChange={onChange}
                // placeholder={"Pergunta"}
            />
</Fragment>
    );
};

export default RichText;