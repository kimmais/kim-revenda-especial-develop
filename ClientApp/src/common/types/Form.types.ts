
export type OnChangeModel = {
    value: string | number | boolean | Array<object>,
    error: string,
    touched: boolean,
    field: string
};

export interface IFormStateField<T> {error: string, value: T};



export interface IResellerFormState {
    id:IFormStateField<string>,
    cnpj: IFormStateField<string>,
    cpf: IFormStateField<string>,
    name: IFormStateField<string>,
    areaCode: IFormStateField<string>,
    cellPhone: IFormStateField<string>,
    email: IFormStateField<string>,
    isAuthorizedResale: IFormStateField<boolean>,
    corporateName: IFormStateField<string>,
    publicPlace: IFormStateField<string>,
    publicPlaceNumber: IFormStateField<string>,
    publicPlaceComplement: IFormStateField<string>,
    publicPlacePostalCode: IFormStateField<string>,
    neighborhood: IFormStateField<string>,
    city: IFormStateField<string>,
    state: IFormStateField<string>,
    parentCompanyId: IFormStateField<string>,
    fisic: IFormStateField<boolean>,
    stateList: IFormStateField<Array<object>>,
    amountOfEquipment:IFormStateField<number>,
    bill:IFormStateField<Array<object>>,
    equipment:IFormStateField<Array<object>>,
    cardTypeOperator:IFormStateField<Array<object>>,
    isActive:IFormStateField<boolean>,
    commisType:IFormStateField<Array<object>>,
    isActiveType:IFormStateField<Array<object>>,
    isAuthorizedResaleType:IFormStateField<Array<object>>,
    typeResellerSelect:IFormStateField<Array<object>>,
    typeReseller:IFormStateField<number>,
    limitReseller:IFormStateField<number>,
    numberOfDaysForPayment:IFormStateField<number>,
    cardTypeOperatorLookup:IFormStateField<string>,
    operatorLookup:IFormStateField<string>,
    personType:IFormStateField<Array<object>>,
    personTypeSelected:IFormStateField<string>,
    resellerType:IFormStateField<Array<object>>,
    resellerTypeSelected:IFormStateField<string|number>,
    isSuspendedResaleSelected:IFormStateField<string|number>,
    isSuspendedResale:IFormStateField<Array<object>>
}


