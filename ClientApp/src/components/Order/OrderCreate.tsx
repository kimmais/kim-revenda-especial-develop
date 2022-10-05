import React, { useState, Fragment, Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import createTheme from "@material-ui/core/styles/createTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { addNotification } from "../../store/actions/notifications.action";
import MaterialTable from "material-table";
import MaterialTableIcons from "../../common/components/MaterialTableIcons";
import {
  maskCPF,
  maskPhoneNumber,
  maskZipCode,
  maskMoneyToLocaleString,
  removeMaskMoneyToLocaleString,
} from "../../Utils/mask.util";

import { addModal, removeModal } from "../../store/actions/modals.action";

import { language } from "../../languages";
import { IStateType } from "../../store/models/root.interface";

import services from "../../requester/services";
import requester from "../../requester/requester";
import Modals from "../../common/components/Modal";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";

import SucessIcon from "../../assets/sucess.svg";
import FailureIcon from "../../assets/failure.svg";

import "./Order.css";

const OrderCreate: React.FC = () => {
  const [formState, setFormState]: any = useState({
    orderItens: { error: "", value: [] },
    resume: {
      error: "",
      value: { value: 0, count: 0 },
      wallet: {
        value: [],
        error: "",
      },
    },
  });
  const accountState = useSelector((state: IStateType) => state.account);
  // const token = account.token;
  const location = useLocation();
  let history = useHistory();
  const [modal, setModal]: any = useState(false);
  const [modalRequest, setModalRequest]: any = useState(false);
  const [statusRequest, setStatusRequest]: any = useState(null);
  const [errorMessage, setErrorMessage]: any = useState("");
  const genericLanguage = language.generic;
  const [loader, setLoader]: any = useState(false);
  const dispatch: Dispatch<any> = useDispatch();

  //    const orderItens = [{operator:{id:1,name:'kimMais'},numberCard:'111111',value:10.5}]

  const addItemOrder = async (item: any) => {
    // formState.cardTypeOperator
    let maxId: number = Math.max.apply(
      Math,
      formState.orderItens.value.map((o: any) => {
        return o.id;
      })
    );
    if (maxId === -Infinity) {
      maxId = 0;
    }

    const thereIsCard: any = formState.orderItens.value.find(
      (e: any) => Number(e.cardNumber) === Number(item.cardNumber)
    );

    if (thereIsCard) {
      dispatch(
        addModal("Atenção", `Este cartão ja está cadastrado.`, "ok", () => null)
      );
      return false;
    }

    const { eligible, cardNumber, id, operatorId } = await getCardTransportAdd(
      item.operatorId,
      item.cardNumber
    );

    item = {
      ...item,
      id,
      cardNumber,
      operatorId,
      eligible,
      tableData: { id: id },
    };

    cardNumber &&
      setFormState((prevState: any) => {
        const newArray = [...prevState.orderItens.value, item];
        return {
          ...prevState,
          resume: {
            error: "",
            value: orderSum(newArray),
          },
          orderItens: {
            error: "",
            value: newArray,
          },
        };
      });
  };

  const updateItemOrder = (item: any) => {
    setFormState((prevState: any) => {
      const newArray = prevState.orderItens.value.map((pr: any) =>
        Number(pr.id) === Number(item.id) ? item : pr
      );

      return {
        ...prevState,
        resume: {
          error: "",
          value: orderSum(newArray),
        },
        orderItens: {
          error: "",
          value: newArray,
        },
      };
    });
  };

  const _getUserWallet = async () => {
    try {
      setLoader(true);
      const service = services.getUserWallet;
      const account = { token: accountState.token };

      const [error, response]: any = await requester(account, service);
      if (!error) {
        setLoader(false);
        const wallet = Array.isArray(response) ? response : [];
        setFormState((prev: any) => {
          return {
            ...prev,
            wallet: {
              value: wallet,
              error: "",
            },
          };
        });

        return wallet;
      } else {
        setLoader(false);
        return [];
      }
    } catch (error) {
      return false;
      console.error(error);
    }
  };

  const getCardTransportAdd = async (
    operatorId: string,
    cardNumber: string
  ) => {
    try {
      const service = {
        ...services.getCardTransportAdd,
        endpoint: services.getCardTransportAdd.endpoint
          .replace("{{operatorId}}", operatorId)
          .replace("{{cardNumber}}", cardNumber),
      };
      const account = { token: accountState.token };

      const [error, response]: any = await requester(account, service);
      if (!error) {
        console.log(response);
        return response;
      } else {
        dispatch(
          addModal("Atenção", error.response.data.message, "ok", () => null)
        );
      }
      return !error;
    } catch (error) {
      return false;
      console.error(error);
    }
  };

  const removeAllItemOrder = () => {
    setFormState((prev: any) => {
      return {
        ...prev,
        resume: { value: 0, count: 0 },
        orderItens: { error: "", value: [] },
      };
    });
  };
  const removeItemOrder = (id: any) => {
    setFormState((prevState: any) => {
      const newArray = prevState.orderItens.value.filter(
        (pr: any) => Number(pr.id) !== Number(id)
      );

      return {
        ...prevState,
        resume: {
          error: "",
          value: orderSum(newArray),
        },
        orderItens: {
          error: "",
          value: newArray,
        },
      };
    });
  };

  const orderSum = (order: any) => {
    const sum = (acc: any, cur: any) => {
      console.log(acc);
      console.log(cur);

      const value = Number(
        Number(removeMaskMoneyToLocaleString(acc.value)) +
          Number(removeMaskMoneyToLocaleString(cur.value))
      ).toFixed(2);
      console.log(value);
      return { value };
    };
    return order.length > 0
      ? { ...order.reduce(sum), count: order.length }
      : { value: 0, count: 0 };
  };

  function goBack(): any {
    return history.goBack();
  }

  function getDisabledClass(): string {
    let isError: boolean = formState.resume.value.count > 0 ? false : true;
    return isError ? "disabled" : "";
  }

  function toggleModalCss(): string {
    return modal ? "show" : "";
  }

  function toggleModalRequestCss(): string {
    return modalRequest ? "show" : "";
  }

  function toggleModal(): void {
    setModal((prev: boolean) => !prev);
  }

  function toggleModalRequest(): void {
    setModalRequest((prev: boolean) => !prev);
  }

  function isFormInvalid(): boolean {
    // return !(formState.orderItens.value?.length <= 15 && formState.wallet.value?.length > 0)
    // return !(formState.orderItens.value?.length <= 15)
    return false;
  }

  function enter(e: any) {
    e.keyCode === 13 && setModalRequest(false);

    // {( e.keyCode === 13 && modal.typeModal !== 'login') && closeModal(modal.id)}
  }

  const _postNewPurchaseOrder = async () => {
    try {
      setLoader(true);
      toggleModal();

      var orderItens = JSON.parse(JSON.stringify(formState.orderItens.value));

      const body = orderItens.map((e: any, index: number) => {
        e.value =
          typeof e.value === "number"
            ? e.value
            : Number(removeMaskMoneyToLocaleString(e.value));

        return e;
      });
      removeAllItemOrder();
      const service = {
        ...services.postNewPurchaseOrder,
      };
      const account = { token: accountState.token };
      const options = {
        data: body,
      };
      const [error, response]: any = await requester(account, service, options);
      console.log(response)
      if (response?.message === "Sucesso") {
        toggleModalRequest();
        setStatusRequest(true);
        setLoader(false);
        removeAllItemOrder();
        _getUserWallet();

        setTimeout(function () {
          setModalRequest(false);
        }, 2000);

        // dispatch(setModificationState(ResellerModificationStatus.Edit));
        // dispatch(addNotification("Sucesso", ``));
        // goBack();
      } else {
        if(error.response.data.message){
          toggleModalRequest();
          setStatusRequest(false);
          setLoader(false);
  
          setErrorMessage(error?.response?.data?.message);
        }


      }
      return !error;
    } catch (error) {
      setLoader(false);
      return false;
      console.error(error);
    }
  };

  useEffect(() => {
    _getUserWallet();
  }, []);

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

  return (
    <Fragment>
      <div className="OrderHitoricPage">
        <div className="card shadow mb-4">
          <div className="card-header-detail py-3">
            <h6 className="m-0 card-header-detail-title">Novo Pedido</h6>
          </div>
          <div className="card-body">
            {/* {!(formState.wallet?.value.length > 0) && !accountState.subsidiary && (
              <div className="wallet-row">
                <div className="wallet-collum">
                  <div className="wallet-item">
                    <div className="wallet-title-fist">
                      <span>Saldo indisponível</span>
                    </div>
                  </div>
                </div>
                <div className="wallet-collum">
                  <div className="wallet-item">
                    <div className="wallet-value"></div>
                  </div>
                </div>
              </div>
            )} */}

            {!accountState.subsidiary && (
              <div className="wallet-card">
                <div className="wallet-row">
                  <div className="wallet-collum">
                    <div className="wallet-item">
                      <div className="wallet-title-fist">
                        <span> {formState.wallet?.value.length > 0 ? 'Saldo disponível': 'Saldo indisponível'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="wallet-collum">
                    <div className="wallet-item">
                      <div className="wallet-value"></div>
                    </div>
                  </div>
                </div>

                {formState.wallet?.value.map((item: any) => (
                  <div className="wallet-row">
                    <div className="wallet-collum">
                      <div className="wallet-item">
                        <div className="wallet-title">
                          <span>
                            {item.type.toLowerCase() === "passagem"
                              ? "VALE SOCIAL"
                              : item.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wallet-collum">
                      <div className="wallet-item">
                        <div className="wallet-value">
                          <span>
                            R${" "}
                            {maskMoneyToLocaleString(item.balance.toFixed(2))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="divider_box">
              <h5>Informe os cartões de transporte para a recarga</h5>

              <div>
                <MuiThemeProvider theme={theme}>
                  <MaterialTable
                    icons={MaterialTableIcons}
                    columns={[
                      {
                        title: "#",
                        field: "id",
                        // editable: "never"
                        hidden: true,
                      },
                      {
                        title: "Operadora",
                        field: "operatorId",
                        lookup: {
                          [accountState.operatorId]: accountState.operatorName,
                        },
                        initialEditValue: accountState.operatorId,
                        editable: "onAdd",
                      },
                      {
                        title: "Numero do cartão",
                        editable: "onAdd",
                        field: "cardNumber",
                        type:"string",
                        validate: (rowData) => {
                          let validateMax =
                            String(rowData.cardNumber)?.length <= 15 ? true : false;
                          let validateMin =
                            String(rowData.cardNumber)?.length >= 10 ? true : false;
                          let isNumeric = /^-?\d+$/.test(rowData.cardNumber)
                          const validate = validateMax && validateMin && isNumeric
                          return { isValid: validate };
                        },
                      },
                      {
                        title: "Valor",
                        field: "value",
                        align: "right",
                        render: (rowData) => (
                          <span> {`R$ ${rowData["value"]}`}</span>
                        ),
                        editComponent: (props) => (
                          <div className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl">
                            <span className="type_value_edit">R$</span>
                            <input
                              type="text"
                              className="MuiInputBase-input MuiInput-input editInput"
                              value={props.value}
                              placeholder="Valor"
                              onChange={(e) =>
                                props.onChange(
                                  maskMoneyToLocaleString(e.target.value)
                                )
                              }
                            />
                          </div>
                        ),
                      },
                    ]}
                    localization={genericLanguage.localization}
                    data={formState.orderItens.value}
                    options={{
                      paging: false,
                      search: false,
                      rowStyle: (data) => {
                        return data.tableData.id % 2
                          ? { background: "#F1F0FF" }
                          : { background: "white" };
                      },
                      headerStyle: {
                        // backgroundColor: '#01579b',
                        // color: '#FFF',
                      },
                    }}
                    title=""
                    // localization={resellerLanguage.localization}
                    editable={{
                      onRowUpdate: async (newData, oldData) => {
                        updateItemOrder(newData);
                      },
                      onRowAdd: async (newData) =>
                        //    console.log(newData),
                        addItemOrder(newData),
                      onRowDelete: async (oldData) =>
                        //    console.log(oldData)
                        removeItemOrder(oldData.id),
                    }}
                    actions={[
                      {
                        icon: () => (
                          <div style={{ fontSize: 16 }}>
                            <DeleteSweepIcon /> Excluir lista de cartões
                          </div>
                        ),
                        tooltip: "Limpar pedido",
                        isFreeAction: true,

                        onClick: removeAllItemOrder,
                      },
                    ]}
                  />
                </MuiThemeProvider>
              </div>
            </div>
            <div className="divider_box">
              <h5>Resumo de Pedido</h5>
              <span className="bold">Quantidades de cartões:</span>{" "}
              <span> {formState.resume.value.count}</span>
              <br />
              <span className="bold">Valor Total: </span>{" "}
              <span>
                R$ {maskMoneyToLocaleString(formState.resume.value.value)}
              </span>
              <div></div>
            </div>
            <>
              {/* <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => goBack()}
                            >
                                Voltar
                    </button> */}
              <button
                type="button"
                className={`btn btn-success left-margin ${getDisabledClass()}`}
                onClick={() => {
                  !isFormInvalid() && toggleModal();
                }}
              >
                Finalizar Pedido
              </button>
            </>

            <Modals />
            <div
              className={`modal fade ${toggleModalCss()}`}
              id="exampleModalCenter"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title modal-title-sucess"
                      id="exampleModalLongTitle"
                    >
                      Confirma o pedido ?
                    </h5>
                  </div>
                  <div className="modal-body">
                    <span className="bold">Quantidades de cartões:</span>{" "}
                    <span>{formState.resume.value.count}</span>
                    <br />
                    <span className="bold">Valor Total:</span>{" "}
                    <span>
                      R$ {maskMoneyToLocaleString(formState.resume.value.value)}
                    </span>
                  </div>
                  {/* <div className="modal-body">...</div> */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={toggleModal}
                    >
                      Não
                    </button>
                    <button
                      type="submit"
                      onClick={_postNewPurchaseOrder}
                      className="btn btn-primary"
                    >
                      Sim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal fade ${toggleModalRequestCss()}`}
            id="statusRequest"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
            tabIndex={10}
            onKeyDown={(e) => {
              enter(e);
            }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div id="modalOrder" className="modal-header">
                  {statusRequest ? (
                    <h5
                      className="modal-title modal-title-sucess"
                      id="exampleModalLongTitle"
                    >
                      Parabéns !
                    </h5>
                  ) : (
                    <h5 className="modal-title " id="exampleModalLongTitle">
                      Ops !
                    </h5>
                  )}
                </div>
                <div className="modal-body modal-type-ok">
                  {statusRequest ? (
                    <>
                      <img alt="" src={SucessIcon} />
                      <div className="modat-body-text">
                        <span className="modalRequestText">
                          Seu pedido foi finalizado com sucesso :)
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <img alt="" src={FailureIcon} />
                      <div className="modat-body-text">
                        <span className="modalRequestText">
                          Não foi possivel realizar seu pedido.<br></br>{" "}
                          {errorMessage}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {/* <div className="modal-body">...</div> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={toggleModalRequest}
                  >
                    ok
                  </button>
                </div>
              </div>
            </div>
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
  );
};

export default OrderCreate;
