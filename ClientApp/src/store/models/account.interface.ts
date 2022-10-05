export interface IAccount {
    email: string;
    name: string;
    token: string;
    balance: number;
    operatorId:number;
    operatorName:string;
    subsidiary:boolean;
    status:boolean;
    id:number;
    isMailIdentified:boolean
    password?: string;
    passwordConfirm?: string;
    passwordOld?:string;
}