export type NumberInputProps = {
    onChange: Function,
    id: string,
    label: string,
    value: number,
    max?: number,
    min?: number,
    inputClass?: string,
    field: string,
    disabled?:boolean,
    int?:boolean
};

export type OnChangeNumberModel = {
    value: number,
    error: string,
    touched: boolean
};