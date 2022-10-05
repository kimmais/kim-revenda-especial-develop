export interface IModal {
    id: number,
    date: Date, 
    title: string,
    text: string,
    typeModal: string,
    onChange: Function,
}