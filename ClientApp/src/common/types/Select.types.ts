export type SelectProps = {
    required?: boolean,
    onChange: Function,
    id: string,
    label: string,
    value: string,
    inputClass?: string,
    options: any[],
    field: string,
    disabled?: boolean
};