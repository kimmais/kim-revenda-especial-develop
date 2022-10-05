import React, { Fragment, useEffect, useState, } from "react";
import services from "../../requester/services";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, IResellerState } from "../../store/models/root.interface";
import requester from "../../requester/requester";
import {
  maskCPF,
  maskPhoneNumber,
  maskZipCode,
  maskMoneyToLocaleString,
  removeMaskMoneyToLocaleString,
  
} from "../../Utils/mask.util";

import Modals from "../../common/components/Modal";

import "./Order.css";


const OrderHitoric: React.FC = () => {

  const token = useSelector((state: IStateType) => state.account.token);
  const [historic, setHistoric]: any = useState([]);
  const [historicDetail, setHistoricDetail]: any = useState(null);
  const [page, setPage]: any = useState(0);
  const [loader, setLoader]: any = useState(false)

  const _getOrderHistoric = async (number = 0) => {
    try {
      setLoader(true)
      const service = {
        ...services.getOrderHistoric,
        endpoint: services.getOrderHistoric.endpoint.replace(
          "{{number}}",
          number
        )
      };
      const account = { token: token };

      const [error, response]: any = await requester(account, service);

      if (!error) {
        setLoader(false)
        setHistoric((prev: any) => [...prev, ...response]);
        setPage((prev: any) => prev + 1)
      } else {
        setLoader(false)
        // dispatch(
        //   addNotification(
        //     "Ocorreu um erro",
        //     `Entre em contato com a equipe tecnica.`
        //   )
        // );
      }
    } catch (error) {
      return false;
      console.error(error);
    }
  };

  useEffect(() => {
    _getOrderHistoric(page);

  }, []);


  return (
    // <div classNameName="cardHistoricBox">
    //     {historic.map((order: any) => (  
    //       <div classNameName="cardHistoric" >
    //       <div>
    //         <span>ID: {order.id}</span>
    //       </div>
    //       <div>
    //         <span>Data: {order.date}</span>
    //       </div>
    //       <div>
    //         <span>Status: {order.statusText}</span>
    //       </div>
    //       <div>
    //         <span>Valor do Pedido: {maskMoneyToLocaleString(order.value.toFixed(2))}</span>
    //       </div>
    //       </div>
    //     ))}
    // </div>
    <Fragment>
      <Modals/>
      <Fragment>
        <div className="OrderHitoricPage">
          <div className="card shadow mb-4">
            <div className="card-header-detail py-3">
              <h6 className="m-0 card-header-detail-title">
                {/* Editar Revendedor */}
              </h6>
            </div>
            <div className="padding" >




              {!historicDetail && historic.map((order: any) => (
                <div className="order-hitoric status-1 fas fa" >
                  <div className="history-content">
                    <p>
                      <span className="value ">R$ {maskMoneyToLocaleString(order.value.toFixed(2))}</span>
                      {/* <span className="method ">Boleto</span> */}
                    </p>
                    <hr />
                    <div className="cards">
                      <div>
                        {/* <span >Valor Total: R$10,00</span> */}
                      </div>

                      <div>
                        {/* <span >Cartão Nº:  036500329858902</span> */}
                      </div>

                    </div>
                  </div>
                  <h3 className="">Status: {order.statusText}</h3>
                  <h3 className="">Pedido N°: {order.id}</h3>

                  <div className="footer">
                    <h4 className="date ">
                      <i className="fas fa-clock margin-right"></i>
                      {order.date}
                    </h4>
                    <div className="history-action" >
                      <button className="btn btn-kim btn-detail-order" onClick={() => { setHistoricDetail(order) }}  ><span>+</span></button>

                    </div>
                  </div>
                </div>

              ))}

              {(!historicDetail && historic.length > 0) &&
                <div className="btn-kim-page-box">
                  <button className="btn btn-kim btn-success btn-close" onClick={() => { _getOrderHistoric(page) }} >Carregar mais Pedidos</button>
                </div>
                }

              {historicDetail &&
                <div>
                  <div className="order-detail">
                    <h3 className="order-detail-title" >Detalhes do Pedido</h3>
                    <div>
                      <p>Pedido:</p>
                      <p >{historicDetail.id}</p>
                    </div>
                    <div>
                      <p>Data:</p>
                      <p >{historicDetail.date}</p>
                    </div>
                    <div>
                      <p>Status:</p>
                      <p className="status-1">{historicDetail.statusText}</p>
                    </div>
                  </div>

                  <div className="order-detail detail-footer">
                    <div className="detal-box collum" ng-repeat="item in historicGroup">
                    {historicDetail.cards.map((card: any) => (
                      <div className="flex-between">
                        <p >{card.cardNumber}</p>
                        <p >R$ {maskMoneyToLocaleString(card.value.toFixed(2))}</p>
                      </div>
                    ))}

                    </div>


                    <div className="flex-between">

                      <p>Valor Total:</p>
                      <p className="info" >R$ {maskMoneyToLocaleString(historicDetail.value.toFixed(2))}</p>
                    </div>
                  </div>
                  <div className="btn-kim-page-box">
                  <button className="btn btn-kim btn-success btn-close maxButton" onClick={() => { setHistoricDetail(null) }} >Voltar</button>
                </div>
                </div>

              }
            </div>
            {loader && <div className="spinner-border-div">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            }
          </div>
        </div>

      </Fragment>
    </Fragment>

  );
};

export default OrderHitoric;
