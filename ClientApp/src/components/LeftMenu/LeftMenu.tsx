import React, { Fragment, useState,Dispatch } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IStateType, IResellerState } from "../../store/models/root.interface";
import { Link } from "react-router-dom";
import kimLogo2 from "../../assets/kim-logo2.svg";
import "./LeftMenu.css";
import services from "../../requester/services";
import requester from "../../requester/requester";
import {
    getResellerState,
  } from "../../store/actions/resellers.actions";

const LeftMenu: React.FC = () => {
  let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);
  const token = useSelector((state: IStateType) => state.account.token);
  const subsidiary = useSelector((state: IStateType) => state.account.subsidiary);
  const status = useSelector((state: IStateType) => state.account.status);
  const isMailIdentified = useSelector((state: IStateType) => state.account.isMailIdentified);
  const dispatch: Dispatch<any> = useDispatch();

  function changeLeftMenuVisibility() {
    setLeftMenuVisibility(!leftMenuVisibility);
  }

  function getCollapseClass() {
    return leftMenuVisibility ? "" : "collapsed";
  }

  const getApiReseller = async (status:boolean) => {
    try {

      const service = {
        ...services.getReseller,
        endpoint: services.getReseller.endpoint.replace("{{status}}", status),
      };
      const account = { token: token };
      const [error, response]: any = await requester(account, service);
      dispatch(getResellerState(response));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <div className="toggle-area">
        <button
          className="btn btn-primary toggle-button"
          onClick={() => changeLeftMenuVisibility()}
        >
          <i className="fas fa-bolt"></i>
        </button>
      </div>

      <ul
        className={`navbar-nav bg-gradient-primary-green sidebar sidebar-dark accordion ${getCollapseClass()}`}
        id="collapseMenu"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="index.html"
        >
          <div className="sidebar-brand-text mx-3">
            <img className="top-menu-img" alt="" src={kimLogo2} />
          </div>
        </a>

        {/* <hr className="sidebar-divider my-0" />

        <li className="nav-item active">
          <Link className="nav-link" to="Home">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <hr className="sidebar-divider" /> */}
        <div className="sidebar-heading">KIM + REVENDA ESPECIAL</div>


        {/* <li className="nav-item">
        <Link
            className="nav-link"
            to={{
              pathname: `/reseller`,
              state: {
                isAuthorizedResale: true,
              },
            }}
            onClick={() => getApiReseller(true)}
          >
            <i className="fas fa-fw fa-users"></i>
            <span>Revendedores</span>
          </Link>
        </li> */}


     { status && <li className="nav-item">
        <Link
            className="nav-link"
            to={{
              pathname: isMailIdentified ? `/order/OrderCreate` : `/account/newPassword`
            }}
          >
            <i className="fas fa-fw fa-shopping-cart"></i>
            <span>Novo Pedido</span>
          </Link>
        </li> }

        <li className="nav-item">
        <Link
            className="nav-link"
            to={{
              pathname: isMailIdentified ?  `/cardTransport/connect` : `/account/newPassword`
            }}
          >
            <i className="fas fa-fw fa-id-card"></i>
            <span>Associar Cartão</span>
          </Link>
        </li>

        <li className="nav-item">
        <Link
            className="nav-link"
            to={{
              pathname: isMailIdentified ?  `/order/Historic` : `/account/newPassword`
            }}
          >
            <i className="fas fa-history"></i>
            <span>Histórico</span>
          </Link>
        </li>
        {!subsidiary && <li className="nav-item">
          {/* <Link
            className="nav-link"
            to={{
              pathname: `/subsidiary/subsidiaryList`,
            }}
          >
            <i className="fas fa-fw fa-users"></i>
            <span>Entidades</span>
          </Link> */}
                    <Link
            className="nav-link"
            to={{
              pathname: isMailIdentified ? `/reseller`: `/account/newPassword`,
            }}
          >
            <i className="fas fa-fw fa-users"></i>
            <span>Entidades</span>
          </Link>
        </li> }
        <li className="nav-item">
        <Link
            className="nav-link"
            to={{
              pathname: isMailIdentified ? `/reports` : `/account/newPassword`
            }}
          >
            <i className="fas fa-fw fa-file-alt"></i>
            <span>Relatórios</span>
          </Link>
        </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Admin
                </div> 


                <li className="nav-item">
                    <Link className="nav-link" to={`/account/newPassword`}>
                        <i className="fas fa-fw fa-key"></i>
                        <span>Trocar Senha</span>
                    </Link>
                    
                    {/* <Link className="nav-link" to={`/reseller`}>
                        <i className="fas fa-fw fa-user"></i>
                        <span>Usuários</span>
                    </Link> */}
                </li>



        <hr className="sidebar-divider d-none d-md-block" />
      </ul>
    </Fragment>
  );
};

export default LeftMenu;
