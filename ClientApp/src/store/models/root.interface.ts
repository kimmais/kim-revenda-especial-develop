
import { IReseller, ResellerModificationStatus } from "./reseller.interface";
import { INotification } from "./notification.interface";
import { IModal } from "./modal.interface";
import { IUser } from "./user.interface";
import { IAccount } from "./account.interface";

export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}
export interface IStateType {
    root: IRootStateType;
    resellers: IResellerState;
    notifications: INotificationState;
    modals: IModalState;
    users: IUserState;
    account: IAccount;
}


export interface IResellerState {
    resellers: IReseller[];
    selectedReseller: IReseller | null;
    modificationState: ResellerModificationStatus;
}



export interface IActionBase {
    type: string;
    [prop: string]: any;
}


export interface INotificationState {
    notifications: INotification[];
}

export interface IUserState {
    users: IUser[];
    admins: IUser[];
}

export interface IModalState {
    modals: IModal[];
}