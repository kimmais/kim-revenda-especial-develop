import React, { Dispatch, useEffect, useState, FormEvent } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { IStateType, IResellerState } from "../../store/models/root.interface";
import { IOrderAuditReport } from "../../store/models/orderAuditReport.interface";
import { useSelector, useDispatch } from "react-redux";
import { groupBy } from '../../Utils/group.utils'
import SelectInput from "../../common/components/Select";
import TextInput from "../../common/components/TextInput";
import Modals from "../../common/components/Modal";
import RadioButtonsMaterialUi from "../../common/components/RadioButtonsMaterialUi";

import "./OrderAuditReport.css";

import services from "../../requester/services";
import requester from "../../requester/requester";

import {
  OnChangeModel
} from "../../common/types/Form.types";

import {
  maskMoneyToLocaleString,
  removeMaskMoneyToLocaleString,
  maskDateFromComplement
} from "../../Utils/mask.util";

import { addModal, removeModal } from "../../store/actions/modals.action";

import kimLogoRevenda from "../../assets/kim-revenda.svg";

const OrderAuditReport: React.FC = () => {

  const token = useSelector((state: IStateType) => state.account.token);
  const dispatch: Dispatch<any> = useDispatch();
  const location: any = useLocation();

  const [groupedOrderedHistorySumDay, setGroupedOrderedHistorySumDay]: any = useState([])
  const [groupedOrderedHistorySum, setGroupedOrderedHistorySum]: any = useState()
  const [groupedOrderedHistory, setGroupedOrderedHistory]: any = useState([])

  const [groupedOrderedHistorySumDayStatusOpen, setGroupedOrderedHistorySumDayStatusOpen]: any = useState([])
  const [groupedOrderedHistorySumStatusOpen, setGroupedOrderedHistorySumStatusOpen]: any = useState()
  const [groupedOrderedHistoryStatusOpen, setGroupedOrderedHistoryStatusOpen]: any = useState([])

  const [groupedOrderedHistorySumDayStatusFinish, setGroupedOrderedHistorySumDayStatusFinish]: any = useState([])
  const [groupedOrderedHistorySumStatusFinish, setGroupedOrderedHistorySumStatusFinish]: any = useState()
  const [groupedOrderedHistoryStatusFinish, setGroupedOrderedHistoryStatusFinish]: any = useState([])


  let {
    id,
    name,
    limitReseller,
    typeReseller,
    numberOfDaysForPayment,
  } = (location.state as any) || "";


  const [formState, setFormState]: any = useState({
    formTypeSelect: {
      error: "",
      value: [
        { id: "1", name: "Analítico" },
        // { id: "0", name: "Sintético" },
      ],
    },
    formType: { error: "", value: "1" },
    startDate: { error: "", value: null },
    endDate: { error: "", value: null },
    orderId: { error: "", value: null },
    dependent: { error: "", value: "2" },
  });

  const orderSum = (order: any) => {

    const sum = (acc: any, cur: any) => {
      const orderCount = Number((Number(acc.orderCount) + Number(cur.orderCount)).toFixed(2));
      //   const amountPaid = Number((Number(acc.amountPaid) + Number(cur.amountPaid)).toFixed(2));
      const commissionAmount = Number((Number(acc.commissionAmount) + Number(cur.commissionAmount)).toFixed(2))
      const feeAmount = Number((Number(acc.feeAmount) + Number(cur.feeAmount)).toFixed(2))
      const rechargeValue = Number((Number(acc.rechargeValue) + Number(cur.rechargeValue)).toFixed(2))
      const netValue = Number((Number(acc.netValue) + Number(cur.netValue)).toFixed(2))
      const totalOrderAmount = Number((Number(acc.totalOrderAmount) + Number(cur.totalOrderAmount)).toFixed(2))
      return {
        ...cur
        , rechargeValue
      }
    }
    const item:IOrderAuditReport = order.length > 0 ? { ...order.reduce(sum)} : {} as IOrderAuditReport;
    return { ...item, orderCount: order.length }

  }

  const orderSumKey = (order: any, dateKeys: any) => {
    const sum = (acc: any, cur: any) => {
      const orderCount = Number((Number(acc.orderCount) + Number(cur.orderCount)).toFixed(2));
      //   const amountPaid = Number((Number(acc.amountPaid) + Number(cur.amountPaid)).toFixed(2));
      const commissionAmount = Number((Number(acc.commissionAmount) + Number(cur.commissionAmount)).toFixed(2))
      const feeAmount = Number((Number(acc.feeAmount) + Number(cur.feeAmount)).toFixed(2))
      const rechargeValue = Number((Number(acc.rechargeValue) + Number(cur.rechargeValue)).toFixed(2))
      const netValue = Number((Number(acc.netValue) + Number(cur.netValue)).toFixed(2))
      const totalOrderAmount = Number((Number(acc.totalOrderAmount) + Number(cur.totalOrderAmount)).toFixed(2))
      return {
        ...cur
        , orderCount
        , netValue
        // , amountPaid
        , commissionAmount
        , feeAmount
        , rechargeValue
        , totalOrderAmount
      }
    }

    return dateKeys.map((key: any) => ({ key, order: { ...order[key].reduce(sum), orderCount: order[key].length } }))

  }


  const orderPediSumKey = (order: any, dateKeys: any) => {
    const sum = (acc: any, cur: any) => {
      const orderCount = Number((Number(acc.orderCount) + Number(cur.orderCount)).toFixed(2));
      //   const amountPaid = Number((Number(acc.amountPaid) + Number(cur.amountPaid)).toFixed(2));
      const commissionAmount = Number((Number(acc.commissionAmount) + Number(cur.commissionAmount)).toFixed(2))
      const feeAmount = Number((Number(acc.feeAmount) + Number(cur.feeAmount)).toFixed(2))
      const rechargeValue = Number((Number(acc.rechargeValue) + Number(cur.rechargeValue)).toFixed(2))
      const netValue = Number((Number(acc.netValue) + Number(cur.netValue)).toFixed(2))
      const totalOrderAmount = Number((Number(acc.totalOrderAmount) + Number(cur.totalOrderAmount)).toFixed(2))
      const composta = cur.dateAmountPaid + "-" + cur.orderId;
      return {
        ...cur
        , composta
        , orderCount
        , netValue
        // , amountPaid
        , commissionAmount
        , feeAmount
        , rechargeValue
        , totalOrderAmount
      }
    }

    return dateKeys.map((key: any) => ({ key, order: { ...order[key].reduce(sum), composta: order[key].reduce(sum).composta, orderCount: order[key].length } }))

  }

  const getOrderAuditReport = async (id: number, startDate: string, endDate: string, orderId: number = 0, dependent: string) => {
    try {

      const service = {
        ...services.getOrderAuditReport,
        endpoint: services.getOrderAuditReport.endpoint
          .replace("{{id}}", id)
          .replace("{{startDate}}", startDate)
          .replace("{{endDate}}", endDate)
          .replace("{{orderId}}", orderId)
          .replace("{{dependent}}", dependent === "2" ? true : false ),
      };
      const account = { token: token };
      const [error, response]: any = await requester(account, service);

      if (response.length === 0)
        dispatch(
          addModal(
            "Atenção",
            `Não existe dados para gerar o relatorio.`,
            'ok',
            () => null
          )
        )

      const groupByDate = groupBy('dateAmountPaid')
      const groupByOrderId = groupBy('orderId')


      const orders: IOrderAuditReport[] = response
      const ordersStatusOpen: IOrderAuditReport[] = orders.filter((order: IOrderAuditReport) => order.orderStatus === 1)
      const ordersStatusFinish: IOrderAuditReport[] = orders.filter((order: IOrderAuditReport) => order.orderStatus === 4)

      const groupedOrdered = groupByDate(orders)
      const groupedId = groupByOrderId(orders)

      const groupedOrderedStatusOpen = groupByDate(ordersStatusOpen)
      const groupedIdStatusOpen = groupByOrderId(ordersStatusOpen)

      const groupedOrderedStatusFinish = groupByDate(ordersStatusFinish)
      const groupedIdStatusFinish = groupByOrderId(ordersStatusFinish)


      const dateKeys = Object.keys(groupedOrdered)
      const dateKeysPedi = Object.keys(groupedId)
      const sumDay = orderSumKey(groupedOrdered, dateKeys)
      const sum = orderSum(orders)

      const dateKeysStatusOpen = Object.keys(groupedOrderedStatusOpen)
      const dateKeysPediStatusOpen = Object.keys(groupedIdStatusOpen)
      const sumDayStatusOpen = orderSumKey(groupedOrderedStatusOpen, dateKeysStatusOpen)
      const sumStatusOpen = orderSum(ordersStatusOpen)


      const dateKeysStatusFinish = Object.keys(groupedOrderedStatusFinish)
      const dateKeysPediStatusFinish = Object.keys(groupedIdStatusFinish)
      const sumDayStatusFinish = orderSumKey(groupedOrderedStatusFinish, dateKeysStatusFinish)
      const sumStatusFinish = orderSum(ordersStatusFinish)




      const groupedOrderedListPedi = dateKeysPedi.map(
        (key: any) => {
          return {
            key, order: groupedId[key],
          }
        }
      )

      const groupedOrderedListPediStatusOpen = dateKeysPediStatusOpen.map(
        (key: any) => {
          return {
            key, order: groupedId[key],
          }
        }
      )

      const groupedOrderedListPediStatusFinish = dateKeysPediStatusFinish.map(
        (key: any) => {
          return {
            key, order: groupedId[key],
          }
        }
      )

      const groupedOrderedList = dateKeys.map(
        (key: any) => {

          var myMap = new Map();
          for (let i = 0; i < groupedOrderedListPedi.length; i++) {
            let order: any = {
              key: null,
              arr: []
            }
            order.key = groupedOrderedListPedi[i].key

            for (let j = 0; j < groupedOrderedListPedi[i].order.length; j++) {
              if (groupedOrderedListPedi[i].order[j].dateAmountPaid === key) {

                if (myMap.has(groupedOrderedListPedi[i].key)) {
                  let get = myMap.get(groupedOrderedListPedi[i].key)

                  if (!get.find((e: any) => e.cardNumber == groupedOrderedListPedi[i].order[j].cardNumber)) {
                    get.push(groupedOrderedListPedi[i].order[j])
                    myMap.set(groupedOrderedListPedi[i].key, get);
                  }

                } else {
                  myMap.set(groupedOrderedListPedi[i].key, [groupedOrderedListPedi[i].order[j]]);
                }
              }

            }

          }

          return {
            key, order: myMap
          }
        }
      )

      const groupedOrderedListStatusOpen = dateKeys.map(
        (key: any) => {

          var myMap = new Map();
          for (let i = 0; i < groupedOrderedListPediStatusOpen.length; i++) {
            let order: any = {
              key: null,
              arr: []
            }
            order.key = groupedOrderedListPediStatusOpen[i].key

            for (let j = 0; j < groupedOrderedListPediStatusOpen[i].order.length; j++) {
              if (groupedOrderedListPediStatusOpen[i].order[j].dateAmountPaid === key) {

                if (myMap.has(groupedOrderedListPediStatusOpen[i].key)) {
                  let get = myMap.get(groupedOrderedListPediStatusOpen[i].key)

                  if (!get.find((e: any) => e.cardNumber == groupedOrderedListPediStatusOpen[i].order[j].cardNumber)) {
                    get.push(groupedOrderedListPediStatusOpen[i].order[j])
                    myMap.set(groupedOrderedListPediStatusOpen[i].key, get);
                  }

                } else {
                  myMap.set(groupedOrderedListPediStatusOpen[i].key, [groupedOrderedListPediStatusOpen[i].order[j]]);
                }
              }

            }

          }

          return {
            key, order: myMap
          }
        }
      )



      const groupedOrderedListStatusFinish = dateKeys.map(
        (key: any) => {

          var myMap = new Map();
          for (let i = 0; i < groupedOrderedListPediStatusFinish.length; i++) {
            let order: any = {
              key: null,
              arr: []
            }
            order.key = groupedOrderedListPediStatusFinish[i].key

            for (let j = 0; j < groupedOrderedListPediStatusFinish[i].order.length; j++) {
              if (groupedOrderedListPediStatusFinish[i].order[j].dateAmountPaid === key) {

                if (myMap.has(groupedOrderedListPediStatusFinish[i].key)) {
                  let get = myMap.get(groupedOrderedListPediStatusFinish[i].key)

                  if (!get.find((e: any) => e.cardNumber == groupedOrderedListPediStatusFinish[i].order[j].cardNumber)) {
                    get.push(groupedOrderedListPediStatusFinish[i].order[j])
                    myMap.set(groupedOrderedListPediStatusFinish[i].key, get);
                  }

                } else {
                  myMap.set(groupedOrderedListPediStatusFinish[i].key, [groupedOrderedListPediStatusFinish[i].order[j]]);
                }
              }

            }

          }

          return {
            key, order: myMap
          }
        }
      )


      setGroupedOrderedHistory(groupedOrderedList)
      setGroupedOrderedHistorySumDay(sumDay)
      setGroupedOrderedHistorySum(sum)

      setGroupedOrderedHistoryStatusOpen(groupedOrderedListStatusOpen)
      setGroupedOrderedHistorySumDayStatusOpen(sumDayStatusOpen)
      setGroupedOrderedHistorySumStatusOpen(sumStatusOpen)

      setGroupedOrderedHistoryStatusFinish(groupedOrderedListStatusFinish)
      setGroupedOrderedHistorySumDayStatusFinish(sumDayStatusFinish)
      setGroupedOrderedHistorySumStatusFinish(sumStatusFinish)

      dispatch((response));
    } catch (error) {
      console.error(error);
    }
  };


  const excell = (e: any) => {
    e.preventDefault();
    let table_div: any = document.getElementById('salesResellerTabele');
    // esse "\ufeff" é importante para manter os acentos         
    var blobData = new Blob(['\ufeff' + table_div.outerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
    var url = window.URL.createObjectURL(blobData);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio.xls'
    a.click();

  }


  const pdf = (e: any) => {
    window.print()    // PRINT THE CONTENTS.
  }

  function hasFormValueChanged(model: OnChangeModel): any {
    setFormState({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }

  function getForm(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    getOrderAuditReport(id, formState.startDate.value, formState.endDate.value, formState.orderId.value | 0, formState.dependent.value);

  }

  useEffect(() => {

  }, []);


  return (
    <>
      <Modals />
      <form className="card shadow mb-4 filter" onSubmit={getForm}>
        <div className="title">
          <h3>Relatorio de Auditoria de Pedido</h3>
        </div>
        <div className="filter_options">
          <div className="search_date_box">
            <div className="search_date">
              <TextInput
                id="input_cpf"
                field="startDate"
                type="date"
                value={formState.startDate.value}
                onChange={hasFormValueChanged}
                required={true}
                maxLength={100}
                label="Data de Inicio"
                placeholder=""
              />
            </div>
            <div className="search_date">
              <TextInput
                id="input_cpf"
                field="endDate"
                type="date"
                value={formState.endDate.value}
                onChange={hasFormValueChanged}
                required={true}
                maxLength={100}
                label="Data Final"
                placeholder=""
              />
            </div>
          </div>

          <div >

            <SelectInput
              id="input_category"
              field="formType"
              label="Tipo"
              options={formState.formTypeSelect.value}
              required={false}
              onChange={hasFormValueChanged}
              value={formState.formType.value}
            />
          </div>
          <div className="search_order">
            <TextInput
              id="input_order"
              field="orderId"
              // type="date"
              value={formState.orderId.value}
              onChange={hasFormValueChanged}
              required={false}
              maxLength={100}
              label="Numero do Pedido"
              placeholder=""
            />
          </div>
          <div className="search_order">
          <RadioButtonsMaterialUi
                            id="input_dependent"
                            field="dependent"
                            options={[{ id: "1", name: "Nao" }, { id: "2", name: "Sim" }]}
                            required={true}
                            label="Visualizar Entidades"
                            onChange={hasFormValueChanged}
                            value={formState.dependent.value}
                          />
</div>


        </div>
        <div className="filter_button">
          <button
            className="btn btn-primary"
            type="submit"
          >
            Gerar Relatorio
                    </button>

        </div>
      </form>
      {(formState?.startDate?.value && formState?.endDate?.value && groupedOrderedHistory.length > 0) &&
        <div className="card shadow mb-4 ">

          <table cellSpacing={0} id="salesResellerTabele" className="report">

            <tbody>
              <tr style={{
                background: "rgb(241, 240, 255)",
                color: "#f76c39"
              }}>

                <td
                  style={{
                    borderTop: "2px solid rgb(67 33 132)"
                  }}
                  colSpan={16}
                  align="center"
                  valign="bottom"
                >
                  <b>
                    <img className="top-menu-img" alt="" src={kimLogoRevenda} />
                  </b>
                </td>
              </tr>
              <tr style={{
                background: "rgb(241, 240, 255)",
                color: "#f76c39"
              }}>

                <td
                  style={{
                    borderBottom: "2px solid rgb(67 33 132)"
                  }}
                  colSpan={16}
                  align="center"
                  valign="bottom"
                >
                  <b>
                    <span >
                      RELATÓRIO DE AUDITORIA DE PEDIDOS
          </span>
                  </b>
                </td>
              </tr>


              {formState.formType.value === "0" && <>
                <tr>

                  <td align="left" valign="bottom">
                    <b>
                      <span color="#CC3300">
                        Sintético
          </span>
                    </b>
                  </td>

                </tr>
                <tr>


                  <td align="left" valign="bottom">
                    Operadora
</td>
                  <td align="left" valign="bottom">
                    <b>
                      <span color="#000000">
                        {groupedOrderedHistorySum && groupedOrderedHistorySum?.operatorName}
                      </span>
                    </b>
                  </td>
                  <td align="left" valign="bottom">
                    Período:
</td>

                  <td align="left" valign="bottom" >
                    <b>
                      <span color="#000000">
                        {`${maskDateFromComplement(formState.startDate.value, false, '/')} a ${maskDateFromComplement(formState.endDate.value, false, '/')}`}
                      </span>
                    </b>
                  </td>


                </tr >

                <tr>

                  <td align="center" valign="bottom">
                    <b>
                      <span color="#000000">
                        <br />
                      </span>
                    </b>
                  </td>

                </tr>
                <tr>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Data
          </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        No. Transações
          </span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="right"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Vr. Pedido
          </span>
                    </b>
                  </td>

                </tr>

                {groupedOrderedHistorySumDay.map((sum: any, sumIndex: number) => (

                  <tr>

                    <td
                      style={{ borderTop: "1px solid rgb(67 33 132)" }}
                      colSpan={1}
                      align="center"
                      valign="bottom">
                      <span color="#000000">
                        {sum.key} {console.log(sum)}
                      </span>
                    </td>

                    <td style={{ borderTop: "1px solid rgb(67 33 132)" }} colSpan={2} align="center" valign="bottom" >
                      <span color="#000000">
                        {sum.order.orderCount}
                      </span>
                    </td>

                    <td
                      style={{ borderTop: "1px solid rgb(67 33 132)" }}
                      colSpan={1}
                      align="right"
                      valign="bottom">
                      <span color="#000000">
                        R$ {maskMoneyToLocaleString(sum.order.rechargeValue.toFixed(2))}
                      </span>
                    </td>

                    {/* <td
              style={{ borderTop: "1px solid rgb(67 33 132)" }}
              colSpan={2}
              align="right"
              valign="bottom">
              <span>R$ {maskMoneyToLocaleString(Number(sum.order.commissionAmount + sum.order.feeAmount).toFixed(2))}</span>
            </td> */}

                    {/* <td
              style={{ borderTop: "1px solid rgb(67 33 132)" }}
              colSpan={1}
              align="right"
              valign="bottom">
              <span color="#000000">
             R$ {maskMoneyToLocaleString(sum.order.netValue.toFixed(2))}
        </span>
            </td> */}
                  </tr>

                ))}


                <tr>

                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Total
          </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"
                  >
                    <b>
                      <span color="#000000">
                        {groupedOrderedHistorySum && console.log(groupedOrderedHistorySum)}
                        {groupedOrderedHistorySum && groupedOrderedHistorySum?.orderCount}
                      </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="right"
                    valign="bottom"
                  >
                    <b>
                      <span color="#000000">
                        R$ {groupedOrderedHistorySum && maskMoneyToLocaleString(groupedOrderedHistorySum?.rechargeValue.toFixed(2))}
                      </span>
                    </b>
                  </td>
                </tr>
                <tr>

                  <td align="center" valign="bottom">
                    <b>
                      <span color="#000000">
                        <br />
                      </span>
                    </b>
                  </td>

                </tr>
              </>}

              {/*    */}

              {formState.formType.value === "1" && <>
                <tr>

                  <td align="left" valign="bottom">
                    <b>
                      <span color="#CC3300">
                        Analítico
          </span>
                    </b>
                  </td>

                </tr>


                <tr>

                  <td align="left" valign="bottom">
                    Operadora
</td>
                  <td align="center" valign="bottom">
                    <b>
                      <span color="#000000">
                        {groupedOrderedHistorySum && groupedOrderedHistorySum?.operatorName}
                      </span>
                    </b>
                  </td>

                  <td align="left" valign="bottom">
                    Período:
</td>

                  <td align="left" valign="bottom" >
                    <b>
                      <span color="#000000">
                        {`${maskDateFromComplement(formState.startDate.value, false, '/')} a ${maskDateFromComplement(formState.endDate.value, false, '/')}`}
                      </span>
                    </b>
                  </td>


                </tr >


                <tr>

                  <td align="center" valign="bottom">
                    <b>
                      <span color="#000000">
                        <br />
                      </span>
                    </b>
                  </td>

                </tr>
                <tr style={{ background: "#f1f0ff" }}>


                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="center"
                    valign="bottom"

                  >
                    {/* <b>
                  <span>Cod. Pedido.</span>
                </b> */}
                  </td>
                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={3}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span>Entidade</span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span>Cod. Pedido.</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Cod. Pedido Item</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Numero do cartão</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="right"
                    valign="bottom"

                  >
                    <b>
                      <span>Vr. Pedido</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Status</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Hora Pedido</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={1}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span>Cod. Pedido Operadora</span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Data Pedido Operadora</span>
                    </b>
                  </td>


                  <td
                    style={{
                      borderTop: "2px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="center"
                    valign="bottom"

                  >
                    <b>
                      <span>Hora Pedido Operadora</span>
                    </b>
                  </td>



                </tr>
                {
                  groupedOrderedHistory.map((sum: any, sunIndex: number) => (

                    [...sum.order].map((order: any, orderIndex: Number, orderArray: any[]) => (
                      <>
                        {console.log([...sum.order])}
                        {orderIndex === 0 &&
                          <tr >
                            <td
                              // style={{ borderTop: "1px solid rgb(67 33 132)" }}
                              colSpan={2}
                              align="left"
                              valign="bottom">
                              <b>
                                <span>{sum.key}</span>
                              </b>
                            </td>
                          </tr>}

                        <tr>
                          <td colSpan={1} align="left" valign="bottom">
                            <span color="#000000">

                            </span>
                          </td>
                          <td colSpan={3} align="left" valign="bottom">
{/* tiririca */}
                           <span color="#007bff" >
                               {`${order[1][0].accountable}`}
                            </span>
                          </td>
                          <td colSpan={3} align="left" valign="bottom">
                            <span color="#000000">
                              {order[0]}
                            </span>
                          </td>

                        </tr>

                        {order[1].map((orderItem: IOrderAuditReport, orderItemIndex: Number, orderItemArray: any[]) => (
                          <>
                            <tr>
                              <td colSpan={5} align="left" valign="bottom">
                                <span color="#000000">
                                
                                </span>
                              </td>

                              
                              <td colSpan={2} align="center" valign="bottom">
                                <span color="#000000">
                                  {orderItem.ordemItemId}
                                </span>
                              </td>

                              <td colSpan={2} align="center" valign="bottom">
                                <span color="#000000">
                                  {orderItem.cardNumber}
                                </span>
                              </td>


                              <td
                                colSpan={1}
                                align="right"
                                valign="bottom">
                                <span color="#000000">
                                  R$ {maskMoneyToLocaleString(orderItem.rechargeValue.toFixed(2))}
                                </span>
                              </td>

                              <td
                                colSpan={1}
                                align="center"
                                valign="bottom">
                                <span style={{ color: orderItem.orderStatus === 4 ? "#28a745" : "#FFC107" }}>
                                  {orderItem.orderStatus === 4 ? "Finalizado" : "Aberto"}
                                </span>
                              </td>
                              <td
                                colSpan={1}
                                align="center"
                                valign="bottom">
                                <span color="#000000">
                                  {orderItem.dateAmountPaidHourAndMinute}
                                </span>
                              </td>

                              <td
                                colSpan={1}
                                align="left"
                                valign="bottom">
                                <span color="#000000">
                                  {orderItem.orderOperatorId}
                                </span>
                              </td>

                              <td
                                colSpan={2}
                                align="center"
                                valign="bottom">
                                <span color="#000000">
                                  {orderItem.dateOperatorAmountPaid}
                                </span>
                              </td>

                              <td
                                colSpan={2}
                                align="center"
                                valign="bottom">
                                <span color="#000000">
                                  {orderItem.dateOperatorAmountPaidHourAndMinute}
                                </span>
                              </td>



                            </tr>
                            {orderItemIndex === orderItemArray.length - 1 &&

                              <tr>

<td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>

                                <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="left"
                                  valign="bottom"

                                >
                                  <b>
                                    <span color="#000000">
                                      Total do Pedido
</span>
                                  </b>
                                </td>
                                <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={2}
                                  align="right"
                                  valign="bottom"
                                >
                                  <b>
                                    <span color="#000000">
                                      R$ {maskMoneyToLocaleString(orderSum(orderItemArray).rechargeValue.toFixed(2))}
                                    </span>
                                  </b>
                                </td>


                                <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={6}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>

                              </tr>
                            }

                          </>

                        ))}


                        {orderIndex === orderArray.length - 1 && <tr>
                          <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={4}
                            align="left"
                            valign="bottom"

                          >
                            <b>
                              <span color="#000000">
                                Total do Dia em Aberto
</span>
                            </b>
                          </td>

                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={2}
                            align="right"
                            valign="bottom"
                          >
                            <b>
                              <span color="#000000">
                                R$ {
                                  groupedOrderedHistorySumDayStatusOpen.
                                    find(
                                      (e: any) =>
                                        e.key === sum.key) ?
                                    maskMoneyToLocaleString(
                                      groupedOrderedHistorySumDayStatusOpen.find(
                                        (e: any) => e.key === sum.key).
                                        order.
                                        rechargeValue.
                                        toFixed(2)
                                    ) :
                                    "0,00"
                                }
                              </span>
                            </b>
                          </td>
                          <td
                            style={{
                              borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={6}
                            align="right"
                            valign="bottom"
                          >

                          </td>
                        </tr>
                        }

                        {orderIndex === orderArray.length - 1 && <tr>
                          <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={4}
                            align="left"
                            valign="bottom"

                          >
                            <b>
                              <span color="#000000">
                                Total do Dia Finalizado
</span>
                            </b>
                          </td>

                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={2}
                            align="right"
                            valign="bottom"
                          >
                            <b>
                              <span color="#000000">
                                R$ {
                                  groupedOrderedHistorySumDayStatusFinish.
                                    find(
                                      (e: any) =>
                                        e.key === sum.key) ?
                                    maskMoneyToLocaleString(
                                      groupedOrderedHistorySumDayStatusFinish.find(
                                        (e: any) => e.key === sum.key).
                                        order.
                                        rechargeValue.
                                        toFixed(2)
                                    ) :
                                    "0,00"
                                }
                              </span>
                            </b>
                          </td>
                          <td
                            style={{
                              borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={6}
                            align="right"
                            valign="bottom"
                          >

                          </td>
                        </tr>
                        }

                        {orderIndex === orderArray.length - 1 && <tr>
                          <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={4}
                            align="left"
                            valign="bottom"

                          >
                            <b>
                              <span color="#000000">
                                Total do Dia
</span>
                            </b>
                          </td>

                          <td
                            style={{
                              // borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={2}
                            align="right"
                            valign="bottom"
                          >
                            <b>
                              <span color="#000000">
                                R$ {groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key) && maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.rechargeValue.toFixed(2))}
                              </span>
                            </b>
                          </td>
                          <td
                            style={{
                              borderTop: "1px solid rgb(67 33 132)",
                              borderBottom: "1px solid rgb(67 33 132)"
                            }}
                            colSpan={6}
                            align="right"
                            valign="bottom"
                          >

                          </td>
                        </tr>
                        }

                      </>
                    ))

                  ))

                }


<tr>
<td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={4}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Total do Período em Aberto
          </span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="right"
                    valign="bottom"
                  >
                    <b>
                      <span color="#000000">
                        R$ {groupedOrderedHistorySumStatusOpen ? maskMoneyToLocaleString(groupedOrderedHistorySumStatusOpen?.rechargeValue?.toFixed(2)) : "0,00"}
                      </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={6}
                    align="right"
                    valign="bottom"
                  >

                  </td>

                </tr>


                <tr>
                <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "1px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={4}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Total do Período Finalizado
          </span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="right"
                    valign="bottom"
                  >
                    <b>
                      <span color="#000000">
                        R$ {groupedOrderedHistorySumStatusFinish ? maskMoneyToLocaleString(groupedOrderedHistorySumStatusFinish?.rechargeValue?.toFixed(2)) : "0,00"}
                      </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "1px solid rgb(67 33 132)"
                    }}
                    colSpan={6}
                    align="right"
                    valign="bottom"
                  >

                  </td>

                </tr>






                <tr>
                <td
                                  style={{
                                    borderTop: "1px solid rgb(67 33 132)",
                                    borderBottom: "2px solid rgb(67 33 132)"
                                  }}
                                  colSpan={4}
                                  align="right"
                                  valign="bottom"
                                >

                                </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={4}
                    align="left"
                    valign="bottom"

                  >
                    <b>
                      <span color="#000000">
                        Total do Período
          </span>
                    </b>
                  </td>

                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={2}
                    align="right"
                    valign="bottom"
                  >
                    <b>
                      <span color="#000000">
                        R$ {groupedOrderedHistorySum && maskMoneyToLocaleString(groupedOrderedHistorySum?.rechargeValue?.toFixed(2))}
                      </span>
                    </b>
                  </td>
                  <td
                    style={{
                      borderTop: "1px solid rgb(67 33 132)",
                      borderBottom: "2px solid rgb(67 33 132)"
                    }}
                    colSpan={6}
                    align="right"
                    valign="bottom"
                  >

                  </td>

                </tr>




              </>}

            </tbody>
          </table>


          <div className="footer_report">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e: any) => excell(e)}
            >
              Gerar planilha
                    </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e: any) => pdf(e)}
            >
              Gerar PDF
                    </button>
          </div>

        </div>
      }
    </>

  );
};

export default OrderAuditReport;
