import { INotification } from "./notification.interface";

export interface ILanguage {
  generic: any
  reseller: ILanguageResellerlanguage

}

export interface ILanguageLocalization {
  header:Object;
  body:Object;
  toolbar:Object;
  pagination:Object;
}

export interface IErrorGeneric{
  title:string;
  text:string;
}


export interface ILanguageResellerlanguage {
  localization: ILanguageLocalization
  notification?:IErrorGeneric
  link:string;
  list:string;
  pending:string;
  approved:string;
  refresh:string;
  addTooltip:string;
  id:string;
  cnpj:string;
  cpf:string;
  cpfOrCnpj:string;
  name:string;
  tradeName:string;
  areaCode:string;
  cellPhone:string;
  email:string;
  isAuthorizedResale:string;
  corporateName:string;
  publicPlace:string;
  publicPlaceNumber:string;
  publicPlaceComplement:string;
  publicPlacePostalCode:string;
  neighborhood:string;
  city:string;
  state:string;
}
