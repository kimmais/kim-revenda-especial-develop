import React, { Fragment, Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { addModal, removeModal } from "../../store/actions/modals.action";
import Modals from "../../common/components/Modal";
import TextInput from "../../common/components/TextInput";
import { OnChangeModel } from "../../common/types/Form.types";
import services from "../../requester/services";
import requester from "../../requester/requester";
import { IStateType } from "../../store/models/root.interface";

import {
  maskCPF,
  maskPhoneNumber,
  removePhoneNumber,
  removeCPF,
  maskNumber,
  maskZipCode,
  maskMoneyToLocaleString,
  removeMaskMoneyToLocaleString,
} from "../../Utils/mask.util";

import {
  validateCPF
} from "../../Utils/validador.util";

import "./Connect.css";

const Connect: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("home", ""));
  const accountState = useSelector((state: IStateType) => state.account);

const initialState = {
  cardNumber: { error: "", value: "" },
  cpf: { error: "", value: "" },
  name: { error: "", value: "" },
  phone: { error: "", value: "" },
  email: { error: "", value: "" }, 
  areaCode: { error: "", value: "" },
}

  const [formState, setFormState] = useState(initialState);
  const [loader, setLoader] : any = useState(false)

  const [connectCard, setConnectCard] = useState(false);

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }


const clear = () => {
  setFormState(initialState)
   setConnectCard(false)
}


function isFormInvalid(): boolean {






  return ((!!formState.cpf.error || !validateCPF(formState.cpf.value) )|| !!formState.cardNumber.error || !formState.name.value || !((Number(formState.areaCode.value) > 0) )
  );
}

const postCardTransportConnect = async () => {


  if (isFormInvalid()) {
    dispatch(
      addModal(
        "Atenção",
        "Sua solicitação possui dados invalidos.\n Corrija e tente novamente.",
        'ok',
        () => null
      )
    );
    return;
  }

  const body = {
    cardNumber:formState.cardNumber.value,
    cpf:removeCPF(formState.cpf.value),
    name:formState.name.value,
    phone:formState.areaCode.value + removePhoneNumber(formState.phone.value),
    email:formState.email.value,
  }



  const { postCardTransportConnect: service } = services
  const user = { token: accountState.token }
  const options = {
    data: body
  }
  const [error, response]:any = await requester(user, service,options)

  if(!error){

    dispatch(
      addModal(
        "Parabéns !",
        "O cartão foi associado com sucesso.",
        'ok',
        () => null
      )
    );

    clear()

  }else{
    dispatch(
      addModal(
        "Atenção",
        error.response.data.message,
        'ok',
        () => null
      )
    );
  }


}
  const getCardTransportCheck = async (operatorId: string = String(accountState.operatorId), cardNumber: string = formState.cardNumber.value) => {
    try {
      setLoader(true)
      const service = {
        ...services.getCardTransportCheck,
        endpoint: services.getCardTransportCheck.endpoint.replace(
          "{{operatorId}}",
          operatorId
        ).replace(
          "{{cardNumber}}",
          cardNumber
        ),
      };
      const account = { token: accountState.token };

      const [error, response]: any = await requester(account, service);

      setLoader(false)
      if (!error) {


        if (!response.valid) {

          dispatch(
            addModal(
              "Atenção",
              "Não foi possível validar o cartão de transporte informado. Confira as informações do número digitado e tente novamente.",
              'ok',
              () => null
            )
          );

          return null;
        }


        if (response.isCpf) {
          setConnectCard(false)
          dispatch(
            addModal(
              "Atenção",
              "Este cartão de transporte já está associado a um usuario na Operadora.",
              'ok',
              () => null
            )
          );

          return null;
        } else {
          setConnectCard(true)
        }



        return response;
      } else {
        dispatch(
          addModal(
            "Atenção",
            error.response.data.message,
            'ok',
            () => null
          )
        );

      }
      return !error;
    } catch (error) {
      return false;
      console.error(error);
    }
  };



  return (
    <Fragment>
      <div className="row Connect">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
          {loader &&  <div className="spinner-border-div">
        <div className="spinner-border" role="status">
  <span className="sr-only">Loading...</span>
</div>
</div>
}
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Associar Cartão</h6>
              <div className="header-buttons">
              </div>
            </div>
            <div className="card-body">
              <Modals />
              <div className="table-responsive portlet">
                <table className="table">
                  {/* <thead className="thead-light">
                    <tr>
                      <th scope="col">Numero do Cartão</th>
                      <th scope="col">Acão</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    <tr className={`table-row`}
                      key={`user`}>

                      <td>           
                        <TextInput id="input_cardNumber"
                        // onFocus={ (e:any)=> e.removeAttribute('readonly')}
                        field="cardNumber"
                        value={maskNumber(formState.cardNumber.value)}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={15}
                        minlength={10}
                        disabled={connectCard}
                        type="text"
                        label="Informe o numero do cartão de transporte com 15 digitos para associar:"
                        placeholder="Numero do Cartão" /></td>

                      <td className="options-button" ><button className="btn btn-primary" onClick={() => getCardTransportCheck()}>Verificar</button> </td>
                    </tr>
                  </tbody>
                </table>


                {connectCard &&
<>
<h4 className="sub-title">Informe os dados do usuario</h4>

<div className="form-cardCheck">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <TextInput
                      id="input_cpf"
                      field="cpf"
                      value={maskCPF(formState.cpf.value)}
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="CPF"
                      placeholder="CPF"

                    />
                  </div>
                  <div className="form-group col-md-6">
                    <TextInput
                      id="input_nome"
                      field="name"
                      value={formState.name.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      minlength={2}
                      label="Nome"
                      placeholder="Nome"

                    />
                  </div>
                </div>


                <div className="form-row">


                <div className="form-group col-md-2">
                    <TextInput
                      id="input_areaCode"
                      field="areaCode"
                      value={formState.areaCode.value}
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={2}
                      label="DDD"
                      placeholder="DDD"

                    />
                  </div>

                  <div className="form-group col-md-4">
                    <TextInput
                      id="input_phone"
                      field="phone"
                      value={maskPhoneNumber(formState.phone.value)}
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Telefone"
                      placeholder="Telefone"

                    />
                  </div>
                  <div className="form-group col-md-6">
                    <TextInput
                      id="input_email"
                      field="email"
                      type="email"
                      value={formState.email.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label="Email"
                      placeholder="Email"

                    />
                  </div>
                </div>

                <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={()=>clear()}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-success left-margin `}
                      onClick={postCardTransportConnect}
                    >
                      Salvar
                    </button>
                  </>
         </div>
         </>
}



              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Connect;
