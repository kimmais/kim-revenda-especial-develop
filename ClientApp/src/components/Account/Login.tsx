import React, { useState, FormEvent, Dispatch } from "react";
import { OnChangeModel } from "../../common/types/Form.types";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import { addModal,removeModal } from "../../store/actions/modals.action";
import { useParams, useLocation, useHistory } from "react-router-dom";

import services from "../../requester/services"
import requester from "../../requester/requester"

import "./Login.css";

const Login: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  // const history = createBrowserHistory({
  //   basename: "/"
  // })

  let history = useHistory();



  const [requestError, setResquestError]: any = useState(false);

  const [formState, setFormState] = useState({
    email: { error: "", value: "" },
    password: { error: "", value: "" }
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  const modalLogin = () =>{
  
    dispatch(
      addModal(
        "Atenção",
        `Sua sessão expirou acesse novamente o sistema.`,
        'login',
        ()=> null
      )
    );
      }

  const _postLogin = async (body: object) => {
    setResquestError(false)
    const { postLogin: service } = services
    const user = { token: '', id: '' }
    const options = {
      data: body
    }
    const [error, response,headers]:any = await requester(user, service,options)
    if(!error){
      dispatch(login(response.email, response.name, response.token, response.balance, response.id,response.operatorId,response.operatorName,response.subsidiary,response.status, response.isMailIdentified));

      if(response.status && response.isMailIdentified) {
        history.push("/order/orderCreate")
      } else if (!response.status && response.isMailIdentified){
        history.push("/order/historic")
      } else{
        history.push("/account/newPassword")
      }
      if(headers["x-token-expiration-time"]){


        var time:any;

    
    
        const resetTimer = () => {
            clearTimeout(time);
            time = setTimeout(modalLogin, 600000)
            // 1000 milliseconds = 1 second
        }

        window.onload = resetTimer;
        // DOM Events
        document.onmousemove = resetTimer;
        document.onkeydown = resetTimer;
        setTimeout(function(){
          modalLogin()
          }, Number(headers["x-token-expiration-time"]));
        
      }


    }else{
      setResquestError(true)
    }

  }

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if(isFormInvalid()) { return; }
    _postLogin({email:formState.email.value, password:formState.password.value})
    
    
  }

  function isFormInvalid() {
    return (formState.email.error || formState.password.error
      || !formState.email.value || !formState.password.value);
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }



  return (

    <div className="container Login">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className={`card-body p-0 ${requestError && "animation-shake"}`}>
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Bem vindo!</h1>
                    </div>
                    <form className="user" onSubmit={submit}  >
                      <div className="form-group">

                        <TextInput id="input_email"
                          field="email"
                          value={formState.email.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Usuário"
                          placeholder="" />
                      </div>
                      <div className="form-group">
                        <TextInput id="input_password"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="text"
                          autocomplete="off"
                          label="Senha"
                          placeholder="" />
                      </div>
                      {/* <div className="form-group">
                        <div className="custom-control custom-checkbox small">
                          <input type="checkbox" className="custom-control-input" id="customCheck" />
                          <label className="custom-control-label"
                            htmlFor="customCheck">Remember Me</label>
                        </div>
                      </div> */}

                     { requestError && <div className="errorLogin">
                        <span>Usuario ou senha incorreta</span>
                      </div>
}
                      <button
                        className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                        type="submit">
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
