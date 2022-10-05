
import { IResellerState, IActionBase } from "../models/root.interface";
import {
    EDIT_RESELLER, ADD_RESELLER, REMOVE_RESELLER, CHANGE_RESELLER_PENDING_EDIT, CLEAR_RESELLER_PENDING_EDIT, SET_MODIFICATION_STATE,
    GET_RESELLER_STATE
} from "../actions/resellers.actions";
import { IReseller } from "../models/reseller.interface";


const initialState: IResellerState = {
    modificationState: 0,
    selectedReseller: null,
    resellers: []
};

function resellersReducer(state: IResellerState = initialState, action: IActionBase): IResellerState {

    switch (action.type) {
        case EDIT_RESELLER: {
            const foundIndex: number = state.resellers.findIndex(pr => pr.id === action.reseller.id);
            let resellers: IReseller[] = state.resellers;
            resellers[foundIndex] = action.reseller;
            return { ...state, resellers: resellers };
        }
        case ADD_RESELLER: {
            let maxId: number = Math.max.apply(Math, state.resellers.map((o) => { return o.id; }));
            if(maxId === -Infinity) { maxId = 0; }
            return {...state, resellers: [...state.resellers, {...action.reseller, id: maxId + 1, tableData: {id: maxId + 1}}]};
        }
        case REMOVE_RESELLER: {
            return { ...state, resellers: state.resellers.filter(pr => pr.id !== Number(action.id)) };
        }
        case CHANGE_RESELLER_PENDING_EDIT: {
            return { ...state, selectedReseller: action.reseller };
        }
        case CLEAR_RESELLER_PENDING_EDIT: {
            return { ...state, selectedReseller: null };
        }
        case SET_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case GET_RESELLER_STATE: {
            let resellers: IReseller[] = action.reseller;
            return { ...state, resellers: resellers };
        }
        default:
            return state;
    }
}


export default resellersReducer;