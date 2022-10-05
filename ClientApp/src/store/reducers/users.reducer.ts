import { IUserState, IActionBase } from "../models/root.interface";
import { ADD_ADMIN, REMOVE_ADMIN } from "../actions/users.action";

const initialState: IUserState = {
    users: [
        { id: 1, firstName: "John", lastName: "Smith", email: "jsmith@em.pl",balance:"",isMailIdentified:false },
        { id: 2, firstName: "Jannice", lastName: "Bing", email: "ohmy@fr.pl",balance:"",isMailIdentified:false }
    ],
    admins: [
        { id: 3, firstName: "Jannet", lastName: "Crock", email: "jcrock@em.pl",balance:"",isMailIdentified:false },
    ]
};

function userReducer(state: IUserState = initialState, action: IActionBase): IUserState {
    switch (action.type) {
        case ADD_ADMIN: {
            return { ...state, users: state.users.filter(x=>x.id !== action.user.id), admins: [...state.admins, action.user]};
        }
        case REMOVE_ADMIN: {
            return { ...state, admins: state.admins.filter(x=>x.id !== action.user.id), users: [...state.users, action.user]};
        }
        default:
            return state;
    }
}

export default userReducer;