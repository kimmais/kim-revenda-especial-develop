import React, { Dispatch, useEffect, useState,  FormEvent } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { IStateType, IResellerState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { groupBy } from '../../Utils/group.utils'
import SelectInput from "../../common/components/Select";
import TextInput from "../../common/components/TextInput";
import Modals from "../../common/components/Modal";
import RadioButtonsMaterialUi from "../../common/components/RadioButtonsMaterialUi";

import "./OrderListage.css";

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

import { addModal,removeModal } from "../../store/actions/modals.action";

import kimLogoRevenda from "../../assets/kim-revenda.svg";

const SalesByPeriod: React.FC = () => {

  const token = useSelector((state: IStateType) => state.account.token);
  const dispatch: Dispatch<any> = useDispatch();
  const location: any = useLocation();

  const [groupedOrderedHistorySumDay, setGroupedOrderedHistorySumDay]: any = useState([])
  const [groupedOrderedHistorySum, setGroupedOrderedHistorySum]: any = useState()
  const [groupedOrderedHistory, setGroupedOrderedHistory]: any = useState([])

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
        { id: "0", name: "Sintético" },
      ],
    },
    formType: { error: "", value: "0" },
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
        , netValue
        // , amountPaid
        , orderCount
        , commissionAmount
        , feeAmount
        , rechargeValue
        , totalOrderAmount
      }
    }

    return {...order.reduce(sum),orderCount: order.length}

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

    return dateKeys.map((key: any) => ({ key, order: { ...order[key].reduce(sum),composta: order[key].reduce(sum).composta, orderCount: order[key].length } }))

  }

  const getReportsSalesByPeriod = async (id: number, startDate: string, endDate: string,  orderId: number = 0, dependent: string) => {
    try {

      const service = {
        ...services.getOrderListage,
        endpoint: services.getOrderListage.endpoint
          .replace("{{id}}", id)
          .replace("{{startDate}}", startDate)
          .replace("{{endDate}}", endDate)
          .replace("{{orderId}}", orderId)
          .replace("{{dependent}}", dependent === "2" ? true : false ),
      };
      const account = { token: token };
      const [error, response]: any = await requester(account, service);

      if(response.length === 0)
      dispatch(
        addModal(
          "Atenção",
          `Não existe dados para gerar o relatorio.`,
          'ok',
          ()=> null
        )
      )

      const groupByDate = groupBy('dateAmountPaid')

      const groupByOrderId = groupBy('orderId')


      const orders = response.map((order: any) => {
        order.netValue = Number((order.rechargeValue - order.commissionAmount - order.feeAmount).toFixed(2));
        return order;
      })
      const groupedOrdered = groupByDate(orders)

      const groupedId = groupByOrderId(orders)

      console.log(groupedId)

      const dateKeys = Object.keys(groupedOrdered)
      const dateKeysPedi = Object.keys(groupedId)
      const sumDay = orderSumKey(groupedOrdered, dateKeys)
      const sumDayPedi = orderPediSumKey(groupedId, dateKeysPedi)
      const sum = orderSum(orders)

      console.log(sumDayPedi)
      console.log(groupedOrdered)

      const groupedOrderedListPedi = dateKeysPedi.map(
        (key: any) => {
          return {
            key, order: groupedId[key], 
            // key,order: groupedId.reduce
          }
        }
      )

      const batata = (value:any) => {

        let a = value;

        console.log(a)
        return a;
      }

      // const groupedOrderedList = dateKeys.map(
      //   (key: any) => {
      //     return {
      //       key, order: groupedOrdered[key], 
      //       // key,order: groupedId.reduce
      //     }
      //   }
      // )

      const groupedOrderedList = dateKeys.map(
        (key: any) => {

          var myMap = new Map();


            for (let i = 0; i < groupedOrderedListPedi.length;i++){
              let order:any = {
                key: null,
                arr: []
              }
                order.key = groupedOrderedListPedi[i].key
              
                for (let j = 0; j < groupedOrderedListPedi[i].order.length; j++) {
                  if (groupedOrderedListPedi[i].order[j].dateAmountPaid === key){
                      
                      if(myMap.has(groupedOrderedListPedi[i].key)){
                        let get = myMap.get(groupedOrderedListPedi[i].key)

                        if(!get.find((e:any)=>e.cardNumber == groupedOrderedListPedi[i].order[j].cardNumber)){
                          get.push(groupedOrderedListPedi[i].order[j])
                          myMap.set(groupedOrderedListPedi[i].key, get);
                        }
                        
                      }else{
                        myMap.set(groupedOrderedListPedi[i].key, [groupedOrderedListPedi[i].order[j]]);
                      }
                  }

                }

            }

          return {
            key, order: myMap, 
            // key,order: groupedId.reduce
          }
        }
      )



      // .map(
      //   e=>{
      //       const groupObjectOrderId = groupByOrderId(e.order);
      //       const dateKeysgroupObjectOrderId = Object.keys(groupObjectOrderId)

      //       return dateKeysgroupObjectOrderId.map(
      //           (key) => {
      //           return {
      //               key, order: groupObjectOrderId[key], total:orderSum(orders)
      //           }
      //           }
      //       )
    
      //       }
      //   )




      setGroupedOrderedHistory(groupedOrderedList)
      setGroupedOrderedHistorySumDay(sumDay)
      setGroupedOrderedHistorySum(sum)
      console.log(groupedOrderedList)

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
    getReportsSalesByPeriod(id, formState.startDate.value, formState.endDate.value, formState.orderId.value|0, formState.dependent.value);

  }

  useEffect(() => {

  }, []);


  return (
    <>
    <Modals/>
      <form className="card shadow mb-4 filter" onSubmit={getForm}>
        <div className="title">
          <h3>Relatório de listagem de pedidos</h3>
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
                colSpan={12}
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
                colSpan={12}
                align="center"
                valign="bottom"
              >
                <b>
                  <span >
                  RELATÓRIO DE LISTAGEM DE PEDIDOS
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
                {`${maskDateFromComplement(formState.startDate.value,false,'/')} a ${maskDateFromComplement(formState.endDate.value,false,'/')}`}
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
                  { groupedOrderedHistorySum &&  console.log(groupedOrderedHistorySum)}
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
                  {`${maskDateFromComplement(formState.startDate.value,false,'/')} a ${maskDateFromComplement(formState.endDate.value,false,'/')}`}
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
                  <span>Numero do cartão</span>
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
                  <span>Hora</span>
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


            </tr>

            {
              groupedOrderedHistory.map((sum: any, sunIndex: number) => (

                [...sum.order].map((order: any, orderIndex: Number, orderArray: any[]) => (
                  <>
                    { console.log([...sum.order]) }
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
                    


                    {order[1].map((orderItem: any, orderItemIndex: Number, orderItemArray: any[]) => (
                    <>
                    <tr>
                      <td colSpan={5} align="left" valign="bottom">
                        <span color="#000000">
                          {/* {orderItem?.orderId} */}
{/* 
                          {console.log( {orderArray: orderArray[orderIndex + 1]?.orderId, order:order.orderId})}
                          {order.orderId == orderArray[orderIndex - 1]?.orderId ? '' : order.orderId } */}
                        </span>
                      </td>

                      <td colSpan={2} align="center" valign="bottom">
                        <span color="#000000">
                          {orderItem?.cardNumber}
                        </span>
                      </td>

                      <td
                        colSpan={2}
                        align="center"
                        valign="bottom">
                        <span color="#000000">
                          {orderItem?.dateAmountPaidHourAndMinute}
                        </span>
                      </td>

                      <td
                        colSpan={1}
                        align="right"
                        valign="bottom">
                        <span color="#000000">
                          R$ {maskMoneyToLocaleString(orderItem?.rechargeValue.toFixed(2))}
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
                        colSpan={9}
                        align="center"
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

                    </tr>
                    }

                    </>

                    ))}

                    {/* --- */}
                    {orderIndex === orderArray.length - 1 && <tr>

                      <td
                        style={{
                          // borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={9}
                        align="center"
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
                        colSpan={1}
                        align="right"
                        valign="bottom"
                      >
                        <b>
                          <span color="#000000">
{/* {console.log(groupedOrderedHistorySumDay.find((e: any) => e.key === "08/11/2020")?.order?.rechargeValue?.toFixed(2))} */}
                          R$ {groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key) && maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.rechargeValue.toFixed(2))}
                          </span>
                        </b>
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
                  borderBottom: "2px solid rgb(67 33 132)"
                }}
                colSpan={9}
                align="center"
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
                      onClick={(e:any) => pdf(e)}
                    >
                    Gerar PDF
                    </button>
        </div>

      </div>
 }
    </>

  );
};

export default SalesByPeriod;
