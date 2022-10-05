import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import { LOG_IN, LOG_OUT } from "../actions/account.actions";

const initialState: IAccount = {
    email: "", name: '', token: '',balance:0, id:0,operatorId:0,operatorName:"",subsidiary:false,status:false,isMailIdentified:false
};

function accountReducer(state: IAccount = initialState, action: IActionBase): IAccount {
    switch (action.type) {
        case LOG_IN: {
            return { ...state, email: (action.email),name: (action.name),token: (action.token),balance: (action.balance),id:(action.id),operatorId:(action.operatorId),operatorName:(action.operatorName),subsidiary: (action.subsidiary),status: (action.status), isMailIdentified:action.isMailIdentified };
        }
        case LOG_OUT: {
            return { ...state, email: ""};
        }
        default:
            return state;
    }
}


export default accountReducer;