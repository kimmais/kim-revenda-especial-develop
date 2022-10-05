export const LOG_IN: string = "LOG_IN";
export const LOG_OUT: string = "LOG_OUT";

export function login(email: string, name: string, token: string, balance:number, id:number, operatorId:number, operatorName:string,subsidiary:boolean,status:boolean,isMailIdentified:boolean): ILogInActionType {
    return { type: LOG_IN, email: email, name: name, token:token, balance: balance, id: id, operatorId: operatorId, operatorName: operatorName, subsidiary:subsidiary, status:status,isMailIdentified:isMailIdentified };
}

export function logout(): ILogOutActionType {
    return { type: LOG_OUT};
}

interface ILogInActionType { type: string, email: string, name:string, token:string, balance:number, id:number, operatorId:number, operatorName:string,subsidiary:boolean,status:boolean,isMailIdentified:boolean};
interface ILogOutActionType { type: string };
