import React, {
  useState,
  Fragment,
  FormEvent,
  Dispatch,
  useEffect,
} from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Reseller.css";

import {addCardTypeOperator,addResellerList,getState,getCardTypeOperatorAndParameters,getDisabledClass,goBack,hasFormValueChanged,inativeEquipment,isFormInvalid,authorizedResale,removeCardTypeOperator,updateCardTypeOperator,toggleModal,saveUser,_postApiReseller} from "./ResellerController";

import { addModal, removeModal } from "../../store/actions/modals.action";

import NumberInput from "../../common/components/NumberInput";

import RadioButtonsMaterialUi from "../../common/components/RadioButtonsMaterialUi";
import TextInput from "../../common/components/TextInput";
import SelectInput from "../../common/components/Select";

import Modals from "../../common/components/Modal";

import { IStateType, IResellerState } from "../../store/models/root.interface";

import {
  OnChangeModel,
  IResellerFormState,
} from "../../common/types/Form.types";

import {
  maskCPF,
  maskCNPJ,
  maskPhoneNumber,
  maskZipCode,
  maskMoneyToLocaleString,
} from "../../Utils/mask.util";

import createTheme from "@material-ui/core/styles/createTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";

import MaterialTable from "material-table";
import MaterialTableIcons from "../../common/components/MaterialTableIcons";

import { language } from "../../languages";

import MobileOffIcon from "@material-ui/icons/MobileOff";
import Modal from "../../common/components/Modal";

declare interface ObjectConstructor {
  assign(...objects: Object[]): Object;
}

const ResellerAdd: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const location = useLocation();
  let history = useHistory();
  let {
    areaCode,
    cpf,
    cnpj,
    name,
    cellPhone,
    email,
    isAuthorizedResale,
    corporateName,
    publicPlace,
    publicPlaceNumber,
    publicPlaceComplement,
    publicPlacePostalCode,
    neighborhood,
    city,
    state,
    isActive,
    limitReseller,
    typeReseller,
    numberOfDaysForPayment,
    operatorId,
    amountOfEquipment,
    operatorName,
    parentCompanyId,
  } = (location.state as any) || "";

  const [modal, setModal]: any = useState(false);
  const [loader, setLoader]: any = useState(false);
  const resellerLanguage = language.reseller;

  const resellers: IResellerState = useSelector(
    (state: IStateType) => state.resellers
  );
  const token = useSelector((state: IStateType) => state.account.token);


  const [formState, setFormState] = useState<IResellerFormState|any>({
    parentCompanyId: { error: "", value: parentCompanyId },
    cnpj: { error: "", value: cnpj },
    cpf: { error: "", value: cpf },
    fisic: { error: "", value: cpf ? true : false },
    name: { error: "", value: name },
    areaCode: { error: "", value: areaCode },
    cellPhone: { error: "", value: cellPhone },
    email: { error: "", value: email },
    isAuthorizedResale: { error: "", value: isAuthorizedResale },
    corporateName: { error: "", value: corporateName },
    publicPlace: { error: "", value: publicPlace },
    publicPlaceNumber: { error: "", value: publicPlaceNumber },
    publicPlaceComplement: { error: "", value: publicPlaceComplement },
    publicPlacePostalCode: { error: "", value: publicPlacePostalCode },
    neighborhood: { error: "", value: neighborhood },
    city: { error: "", value: city },
    stateList: { error: "", value: [] },
    state: { error: "", value: state },
    amountOfEquipment: { error: "", value: amountOfEquipment },
    bill: { error: "", value: [] },
    equipment: { error: "", value: [] },
    cardTypeOperator: { error: "", value: [] },
    isActive: { error: "", value: isActive },
    commisType: {
      error: "",
      value: [
        { id: "P", name: "Porcentagem" },
        { id: "V", name: "Valor" },
      ],
    },
    isActiveType: {
      error: "",
      value: [
        { id: "1", name: "Ativo" },
        { id: "0", name: "Inativo" },
      ],
    },
    isAuthorizedResaleType: {
      error: "",
      value: [
        { id: "0", name: "Não Autorizado" },
        { id: "1", name: "Autorizado" },
      ],
    },
    typeResellerSelect: {
      error: "",
      value: [
        { id: "1", name: "Pré Pago" },
        { id: "2", name: "Pós Pago" },
      ],
    },
    typeReseller: { error: "", value: 1 },
    limitReseller: { error: "", value: 0 },
    numberOfDaysForPayment: { error: "", value: numberOfDaysForPayment },
    cardTypeOperatorLookup: { error: "", value: "" },
    operatorLookup: { error: "", value: "" },
    personType: {
      error: "",
      value: [
        { id: 1, name: "Pessoa Física" },
        { id: 2, name: "Pessoa Jurídica" },
      ],
    },
    personTypeSelected: { error: "", value: "1" },
    resellerType: {
      error: "",
      value: [
        { id: 1, name: "Normal" },
        { id: 2, name: "Especial" },
      ],
    },
    resellerTypeSelected: { error: "", value: "2" },
    isSuspendedResaleSelected: { error: "", value: "1" },
    isSuspendedResale: {
      error: "",
      value: [
        { id: 1, name: "Ativo" },
        { id: 2, name: "Suspenso" },
      ],
    },
  });

  const theme = createTheme({
    overrides: {
      MuiCheckbox: {
        root: {
          padding: "5px",
        },
        colorSecondary: {
          // color: '#E74040',
          "&$checked": {
            // color: 'primary',
          },
        },
      },
    },
    props: {
      MuiCheckbox: {
        color: "primary",
        // style: {backgroundColor:'#4caf50'}
      },
      MuiRadio: {
        color: "primary",
      },
    },
    palette: {
      primary: {
        main: "#4caf50",
      },
      secondary: {
        main: "#432184",
      },
    },
  });

  useEffect(() => {
    getCardTypeOperatorAndParameters(setFormState,dispatch,token,isAuthorizedResale);
    getState(setFormState,token);
  }, []);

  return (
    <Fragment>
      <Fragment>
        <div className="">
          <div className="card shadow mb-4">
            <div className="card-header-detail py-3">
              <h6 className="m-0 card-header-detail-title">
                Adicionar Entidade
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={(form)=>saveUser(dispatch,setModal,formState,setLoader,goBack,history,token,isAuthorizedResale,form)}>
                <div className="divider_box">
                  <h5>Informações da Entidade</h5>
                 <div className="form-row">
                     <div className="form-group col-md-6">
                      <RadioButtonsMaterialUi
                        id="input_isSuspendedResaleSelected"
                        field="isSuspendedResaleSelected"
                        options={formState.isSuspendedResale.value}
                        required={true}
                        label="Status de atividade"
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        value={formState.isSuspendedResaleSelected.value}
                      />
                    </div>

                  </div>
                  {formState.parentCompanyId.value && (
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <TextInput
                          id="input_parentCompanyId"
                          field="parentCompanyId"
                          value={formState.parentCompanyId.value}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          required={true}
                          disabled={true}
                          maxLength={100}
                          label="Empresa Pai"
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      {formState.personTypeSelected.value == 1 && (
                        <TextInput
                          id="input_cpf"
                          field="cpf"
                          value={maskCPF(formState.cpf.value)}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          required={true}
                          disabled={isAuthorizedResale}
                          maxLength={100}
                          label="CPF"
                          placeholder=""
                        />
                      )}

                      {formState.personTypeSelected.value == 2 && (
                        <TextInput
                          id="input_cnpj"
                          field="cnpj"
                          value={maskCNPJ(formState.cnpj.value)}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          disabled={isAuthorizedResale}
                          required={true}
                          maxLength={100}
                          label="CNPJ"
                          placeholder=""
                        />
                      )}
                    </div>

                    <div className="form-group col-md-6">
                      {formState.personTypeSelected.value == 1 && (
                        <TextInput
                          id="input_name"
                          field="name"
                          value={formState.name.value}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          required={true}
                          maxLength={100}
                          label="Nome"
                          placeholder=""
                        />
                      )}
                      {formState.personTypeSelected.value == 2 && (
                        <TextInput
                          id="input_corporateName"
                          field="corporateName"
                          value={formState.corporateName.value}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          required={true}
                          maxLength={100}
                          label="Nome Fantasia"
                          placeholder=""
                        />
                      )}
                    </div>
                  </div>

                  {formState.personTypeSelected.value == 2 && (
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <TextInput
                          id="input_name"
                          field="name"
                          value={formState.name.value}
                          onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                          required={true}
                          maxLength={100}
                          label="Razão Social"
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group col-md-2">
                      <TextInput
                        id="input_area_code"
                        field="areaCode"
                        value={formState.areaCode.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={2}
                        label="DDD"
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <TextInput
                        id="input_cell_phone"
                        field="cellPhone"
                        value={maskPhoneNumber(formState.cellPhone.value)}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={10}
                        label="Celular"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <TextInput
                        id="input_email"
                        field="email"
                        value={formState.email.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="Email"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-9">
                      <TextInput
                        id="input_public_place"
                        field="publicPlace"
                        value={formState.publicPlace.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="Logradouro"
                        placeholder=""
                      />
                    </div>
                    <div className="form-group col-md-3">
                      <TextInput
                        id="input_public_place_number"
                        field="publicPlaceNumber"
                        value={formState.publicPlaceNumber.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="Numero"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <TextInput
                        id="input_public_place_complement"
                        field="publicPlaceComplement"
                        value={formState.publicPlaceComplement.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={false}
                        maxLength={100}
                        label="Complemento"
                        placeholder=""
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <TextInput
                        id="input_public_place_postal_code"
                        field="publicPlacePostalCode"
                        value={maskZipCode(
                          formState.publicPlacePostalCode.value
                        )}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="CEP"
                        placeholder=""
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <TextInput
                        id="input_neighborhood"
                        field="neighborhood"
                        value={formState.neighborhood.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="Bairro"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <TextInput
                        id="input_city"
                        field="city"
                        value={formState.city.value}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        required={true}
                        maxLength={100}
                        label="Cidade"
                        placeholder=""
                      />
                    </div>
                    <div className="form-group col-md-3">
                      <SelectInput
                        id="input_stateSelected"
                        field="state"
                        label="Estado"
                        options={formState.stateList.value}
                        required={true}
                        onChange={(model:OnChangeModel)=>hasFormValueChanged(setFormState,formState,model)}
                        value={formState.state.value}
                        // errorSubmit={(errorSubmit && !formState.stateSelected.value)}
                      />
                    </div>
                  </div>
                </div>

  
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => goBack(history)}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className={`btn btn-success left-margin ${getDisabledClass(formState)}`}
                    onClick={()=>authorizedResale(setFormState,dispatch,isFormInvalid,formState)}
                  >
                    Salvar
                  </button>
                </>
                <Modals />
              </form>
            </div>
            {loader && (
              <div className="spinner-border-div">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    </Fragment>
  );
};

export default ResellerAdd;
