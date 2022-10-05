import { IActionBase, IModalState } from "../models/root.interface";
import { ADD_MODAL, REMOVE_MODAL } from "../actions/modals.action";

const initialState: IModalState = {
    modals: []
};

function modalReducer(state: IModalState = initialState, action: IActionBase): IModalState {
    switch (action.type) {
        case ADD_MODAL: {
            let maxId: number= Math.max.apply(Math, state.modals.map(o =>  o.id));
            if(maxId === -Infinity) { maxId = 0; }
            let newItem = {
                id: maxId + 1,
                date: new Date(),
                title: action.title,
                text: action.text,
                typeModal: action.typeModal,
                onChange:action.onChange
            };
            return {...state, modals: [...state.modals, newItem]};
        }
        case REMOVE_MODAL: {
            return {...state, modals: state.modals
                .filter(Modal => Modal.id !== action.id)};
        }
        default:
            return state;
    }
}


export default modalReducer;