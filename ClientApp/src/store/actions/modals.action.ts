export const ADD_MODAL: string = "ADD_MODAL";
export const REMOVE_MODAL: string = "REMOVE_MODAL";

export function addModal(title: string, text: string, typeModal: string, onChange: Function): IAddModalActionType {
    return { type: ADD_MODAL, text: text, title: title, typeModal: typeModal, onChange: onChange };
}

export function removeModal(id: number): IRemoveModalActionType {
    return { type: REMOVE_MODAL, id: id };
}

interface IAddModalActionType { type: string, text: string, title: string, typeModal: string, onChange:Function };
interface IRemoveModalActionType { type: string, id: number };
