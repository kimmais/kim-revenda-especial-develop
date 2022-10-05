export interface IReseller {
    id: number;
    cnpj: string;
    cpf: string;
    name: string;
    areaCode: string;
    cellPhone: string;
    email: string;
    isAuthorizedResale: boolean;
    corporateName: string;
    publicPlace: string;
    publicPlaceNumber: string;
    publicPlaceComplement: string;
    publicPlacePostalCode: string; 
    neighborhood: string;
    city: string;
    state: string;
    typeReseller:string;
    isSuspendedResale:boolean;
    limitReseller:string;
    numberOfDaysForPayment:string;
    amountOfEquipment:number;
    parentCompanyId:number|null;
    cardTypeOperator?:any[]
    isActive?:boolean;
    tableData?:any;
    cpfOrCnpj?:any;
    phoneComplete?:any;
}

export enum ResellerModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}