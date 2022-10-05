import React, { Fragment, Dispatch, useState, useEffect } from "react";
import TopCard from "../../common/components/TopCard";
import { IUser } from "../../store/models/user.interface";
import { IAccount } from "../../store/models/account.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { login } from "../../store/actions/account.actions";
import { updateCurrentPath } from "../../store/actions/root.actions";
import TextInput from "../../common/components/TextInput";
import { OnChangeModel } from "../../common/types/Form.types";
import { addModal,removeModal } from "../../store/actions/modals.action";

import services from "../../requester/services"
import requester from "../../requester/requester"
import Modals from "../../common/components/Modal";

const NewPassword: React.FC = () => {

  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("user", "list"));
  
  const users: IUser[] = useSelector((state: IStateType) => state.users.users);
  // const admins: IUser[] = useSelector((state: IStateType) => state.users.admins);
  const account:IAccount = useSelector((state:IStateType)=>state.account)


  const [formState, setFormState] = useState({
    password: { error: "", value: "" },
    passwordNew: { error: "", value: "" }, 
    passwordNewConfirm: { error: "", value: "" }
});

const _postChangePassword = async (body: object) => {
    const { postChangePassword: service } = services
    const user = { token: account.token }
    const options = {
      data: body
    }
    const [error, response]:any = await requester(user, service,options)

    if(!error){

      setFormState(
      {
        password: { error: "", value: "" },
        passwordNew: { error: "", value: "" }, 
        passwordNewConfirm: { error: "", value: "" }
    })

    dispatch(login(account.email, account.name, account.token, account.balance, account.id,account.operatorId,account.operatorName,account.subsidiary,account.status, true))
        dispatch(
            addModal(
              "Parabens !",
              `Sua senha foi alterado com sucesso!`,
              'ok',
              ()=> null
            )
          );
    }else{
        dispatch(
            addModal(
              "Ixi :(",
              `Não foi Possivel fazer sua solicitação. Verifique os dados e tente novamente.`,
              'ok',
              ()=> null
            )
          );
    }

 
  }

  function isFormInvalid(): boolean {
    return (
        !formState.password.value || !formState.passwordNew.value || !formState.passwordNewConfirm.value || (formState.passwordNew.value !== formState.passwordNewConfirm.value) || (formState.password.value === formState.passwordNewConfirm.value)
    );
  }

  function sendForm(): void {

    if(isFormInvalid()){
        dispatch(
            addModal(
              "Ixi :(",
              `Não foi Possível fazer sua solicitação. Verifique os dados e tente novamente.`,
              'ok',
              ()=> null
            )
          );

    }else{
        _postChangePassword({password:formState.password.value,passwordNew:formState.passwordNew.value})

    }



  }


  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }


  useEffect(() => {
    !account.isMailIdentified && dispatch(
      addModal(
        "Bem Vindo",
        `Para usar o sistema você deve trocar sua senha de acesso`,
        'ok',
        ()=> null
      )
    );
  }, []);

  return (
    <Fragment>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Trocar Senha</h6>
              <div className="header-buttons">
              </div>
            </div>
            <div className="card-body">
                <Modals />
              <div className="table-responsive portlet">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      {/* <th scope="col">Nome</th>
                      <th scope="col">Email</th> */}
                      <th scope="col">Senha Antiga</th>
                      <th scope="col">Senha Nova</th>
                      <th scope="col">Confirmar Senha</th>
                      <th scope="col">Acão</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr className={`table-row`}
        key={`user_${account.id}`}>
        
        <td >             <TextInput inputClass="input_password"  id="input_password_old"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="text"
                          autocomplete="off"
                          label=""
                          placeholder="" /></td>
        <td > <TextInput inputClass="input_password" id="input_password"
                          field="passwordNew"
                          value={formState.passwordNew.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="text"
                          autocomplete="off"
                          label=""
                          placeholder="" /></td>
        <th  > <TextInput inputClass="input_password" id="input_password_confirm"
                          field="passwordNewConfirm"
                          value={formState.passwordNewConfirm.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="text"
                          autocomplete="off"
                          label=""
                          placeholder="" /></th>
        <td><button className="btn btn-danger" onClick={sendForm}>Alterar Senha</button> </td>
      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">User List</h6>
              <div className="header-buttons">
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive portlet">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">First name</th>
                      <th scope="col">Last name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userElements}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment >
  );
};

export default NewPassword;
