import { IReseller, ResellerModificationStatus } from "../models/reseller.interface";
export const EDIT_RESELLER: string = "EDIT_RESELLER";
export const ADD_RESELLER: string = "ADD_RESELLER"; 
export const REMOVE_RESELLER: string = "REMOVE_RESELLER";
export const CHANGE_RESELLER_PENDING_EDIT: string = "CHANGE_RESELLER_PENDING_EDIT";
export const CLEAR_RESELLER_PENDING_EDIT: string = "CLEAR_RESELLER_PENDING_EDIT";
export const SET_MODIFICATION_STATE: string = "SET_MODIFICATION_STATE";
export const GET_RESELLER_STATE: string = "GET_RESELLER_STATE"

export function editReseller(reseller: IReseller): IEditResellerActionType {
    return { type: EDIT_RESELLER, reseller: reseller };
}

export function addReseller(reseller: IReseller): IAddResellerActionType {
    return { type: ADD_RESELLER, reseller: reseller };
}

export function removeReseller(id: string): IRemoveResellerActionType {
    return { type: REMOVE_RESELLER, id: id };
}

export function clearSelectedReseller(): IClearSelectedResellerActionType {
    return { type: CLEAR_RESELLER_PENDING_EDIT };
}

export function setModificationState(value: ResellerModificationStatus): ISetModificationStateActionType {
    return { type: SET_MODIFICATION_STATE, value: value };
}

export function changeSelectedReseller(reseller: IReseller): IChangeSelectedResellerActionType {
    return { type: CHANGE_RESELLER_PENDING_EDIT, reseller: reseller };
}

export function getResellerState(reseller: IReseller): IGetResellerState {
    return { type: GET_RESELLER_STATE, reseller: reseller };
}





interface IEditResellerActionType { type: string, reseller: IReseller };
interface IAddResellerActionType { type: string, reseller: IReseller };
interface IRemoveResellerActionType { type: string, id: string };
interface ISetModificationStateActionType { type: string, value: ResellerModificationStatus };
interface IClearSelectedResellerActionType { type: string };
interface IChangeSelectedResellerActionType { type: string, reseller: IReseller };
interface IGetResellerState { type: string, reseller: IReseller };
