import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IModal } from "../../store/models/modal.interface";
import { removeModal, addModal } from "../../store/actions/modals.action";
import TextInput from "../../common/components/TextInput";
import { OnChangeModel } from "../../common/types/Form.types";

import { login } from "../../store/actions/account.actions";

import services from "../../requester/services"
import requester from "../../requester/requester"

import { IAccount } from "../../store/models/account.interface";




const Modal: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const modals: IModal[] = useSelector((state: IStateType) =>
    state.modals.modals);

  const modalLogin = () => {

    dispatch(
      addModal(
        "Atenção",
        `Sua sessão expirou acesse novamente o sistema.`,
        'login',
        () => null
      )
    );
  }

  const account: IAccount = useSelector((state: IStateType) => state.account)

  const [requestError, setResquestError]: any = useState(false);

  const initialState = {
    password: { error: "", value: "" }
  }

  const [formState, setFormState] = useState(initialState);

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  const _postLogin = async (id: any) => {
    setResquestError(false)
    const { postLogin: service } = services
    const user = { token: '', id: '' }
    const options = {
      data: {
        "email": account.email,
        "password": formState.password.value
      }
    }
    const [error, response, headers]: any = await requester(user, service, options)
    if (!error) {
      setResquestError(false)
      dispatch(login(response.email, response.name, response.token, response.balance, response.id,response.operatorId,response.operatorName,response.subsidiary,response.status,response.isMailIdentified));
      closeModal(id)

      setFormState(initialState)

      if (headers["x-token-expiration-time"]) {
        setTimeout(function () {
          modalLogin()
        }, Number(headers["x-token-expiration-time"]));

      }


    } else {
      setResquestError(true)

    }
  }

  function closeModal(id: number) {
    dispatch(removeModal(id));
  }

  function logOut(id: number) {
    dispatch(removeModal(id));
    dispatch(login('', '', '', 0, 0,0,'',false,false,false));
  }


  function enter(e:any,modal:IModal){
    
    if(e.keyCode === 13) {
      switch (modal.typeModal) {
        case 'login':
          _postLogin(modal.id)
          break;
      
        default:
          closeModal(modal.id)
          break;
      }
  
    }

    // {( e.keyCode === 13 && modal.typeModal !== 'login') && closeModal(modal.id)}
  }

  const modalList = modals.map(modal => {
    return (
      <div
        key={`modal-default-${modal.id}`}
        className={`modal fade show`}
        id={`modal-default-${modal.id}`}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        tabIndex={modal.id}
        onKeyDown={(e)=>{enter(e,modal)}}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
        >
          <div className={`modal-content ${requestError && "animation-shake"}`}>
            <div className="modal-header">
              <input id="modalId" hidden value={modal.id}></input>
              <h5 className="modal-title" id="exampleModalLongTitle">
                {modal.title}
              </h5>
              {modal.typeModal !== 'login' && <div>  <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => closeModal(modal.id)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              </div>}
            </div>
            <div className={`modal-body modal-type-${modal.typeModal}`}>
              <div>
                {modal.text}
              </div>
              {modal.typeModal === 'login' && <div> <div className="modal-input-password">
                <TextInput id="input_password"
                  field="password"
                  value={formState.password.value}
                  onChange={hasFormValueChanged}
                  required={true}
                  maxLength={100}
                  type="text"
                  autocomplete="off"
                  label=""
                  placeholder="" />
              </div>

                {requestError && <div className="errorLogin">
                  <span>Senha incorreta</span>
                </div>
                }

              </div>}
            </div>
            <div className="modal-footer">
              <>

                {modal.typeModal === 'submit' &&
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => closeModal(modal.id)}
                    >
                      Não
                    </button>

                    <button type='submit' className="btn btn-primary">
                      Sim
                  </button>
                  </>
                }
                {modal.typeModal === 'button' &&
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => closeModal(modal.id)}
                    >
                      Não
                  </button>
                    <button onClick={() => { modal.onChange(); closeModal(modal.id) }} type='button' className="btn btn-primary">
                      Sim
              </button>
                  </>
                }
                {(modal.typeModal == 'ok') &&
                  <button data-dismiss="modal" onClick={() => { modal.onChange(); closeModal(modal.id) }} type='button' className="btn btn-primary">
                    OK
                     </button>
                }
                {modal.typeModal === 'login' &&
                  <>
                    <button onClick={() => { logOut(modal.id) }} type='button' className="btn btn-danger">
                      Sair
              </button>
                    <button onClick={() => { _postLogin(modal.id) }} type='button' className="btn btn-primary">
                      Login
              </button>
                  </>
                }



              </>
            </div>
          </div>
        </div>
      </div>





    )
  });

  return (
    <div className="toast-wrapper">
      {modalList}
    </div>
  );
};

export default Modal;
