import React, { Dispatch, useEffect, useState,  FormEvent } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { IStateType } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { groupBy } from '../../Utils/group.utils'
import SelectInput from "../../common/components/Select";
import TextInput from "../../common/components/TextInput";
import Modals from "../../common/components/Modal";
import { addModal,removeModal } from "../../store/actions/modals.action";
import RadioButtonsMaterialUi from "../../common/components/RadioButtonsMaterialUi";

import { IFinancialStatement } from "../../store/models/finacialStatement.interface";

import "./FinancialStatement.css";

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

import kimLogoRevenda from "../../assets/kim-revenda.svg";

const FinancialStatement: React.FC = () => {

  const token = useSelector((state: IStateType) => state.account.token);
  const subsidiary = useSelector((state: IStateType) => state.account.subsidiary);
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
        { id: "1", name: "Analítico" }
      ],
    },
    formType: { error: "", value: "0" },
    startDate: { error: "", value: null },
    endDate: { error: "", value: null },
    dependent: { error: "", value: "1" }
  });

  const orderSum = (order: any) => {

    const sum = (acc: any, cur: any) => {
      const orderCount = Number((Number(acc.orderCount) + Number(cur.orderCount)).toFixed(2));
      const rechargeValue = Number((Number(acc.rechargeValue) + Number(cur.rechargeValue)).toFixed(2))

      return {
        ...cur
        , orderCount
        , rechargeValue

      }
    }

    return {...order.reduce(sum),orderCount: order.length}

  }

  const orderSumKey = (order: any, dateKeys: any) => {
    const sum = (acc: any, cur: any) => {
      const orderCount = Number((Number(acc.orderCount) + Number(cur.orderCount)).toFixed(2));
      const rechargeValue = Number((Number(acc.rechargeValue) + Number(cur.rechargeValue)).toFixed(2))
      return {
        ...cur
        , orderCount
        , rechargeValue
      }
    }

    return dateKeys.map((key: any) => ({ key, order: { ...order[key].reduce(sum), orderCount: order[key].length } }))

  }

  const getFinancialStatement = async (startDate: string, endDate: string, dependent:string) => {
    try {

      const service = {
        ...services.getFinancialStatement,
        endpoint: services.getFinancialStatement.endpoint
          .replace("{{startDate}}", startDate)
          .replace("{{endDate}}", endDate)
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


      const orders = response.map((order: any) => {
        return order;
      })
      const groupedOrdered = groupByDate(orders)

      const dateKeys = Object.keys(groupedOrdered)
      const sumDay = orderSumKey(groupedOrdered, dateKeys)
      const sum = orderSum(orders)

      console.log(sum)
      console.log(groupedOrdered)

      const groupedOrderedList = dateKeys.map(
        (key: any) => {
          return {
            key, order: groupedOrdered[key]
          }
        }
      )
      setGroupedOrderedHistory(groupedOrderedList)
      setGroupedOrderedHistorySumDay(sumDay)
      setGroupedOrderedHistorySum(sum)
      console.log(groupedOrderedList)
      console.log(setGroupedOrderedHistorySum)

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
    getFinancialStatement(formState.startDate.value, formState.endDate.value,formState.dependent.value);

  }

  useEffect(() => {

  }, []);


  return (
    <>
    <Modals/>
      <form className="card shadow mb-4 filter" onSubmit={getForm}>
        <div className="title">
          <h3> Relatório de extrato financeiro por período </h3>
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
            <div className="search_date">              <TextInput
              id="input_cpf"
              field="endDate"
              type="date"
              value={formState.endDate.value}
              onChange={hasFormValueChanged}
              required={true}
              maxLength={100}
              label="Data Final"
              placeholder=""
            /></div>
          </div>

          <div>

            <SelectInput
              id="input_category"
              field="formType"
              label="Tipo"
              options={formState.formTypeSelect.value}
              required={true}
              onChange={hasFormValueChanged}
              value={formState.formType.value}
            />
          </div>

         { !subsidiary &&   <div className="search_order">
          <RadioButtonsMaterialUi
                            id="input_dependent"
                            field="dependent"
                            options={[{ id: "1", name: "Nao" }, { id: "2", name: "Sim" }]}
                            required={true}
                            label="Visualizar Entidades"
                            onChange={hasFormValueChanged}
                            value={formState.dependent.value}
                          />
</div>}
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
                  RELATÓRIO DE EXTRATO FINANCEIRO POR PERÍODO
                  
          </span>
                </b>
              </td>
            </tr>




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
              <td align="left" valign="bottom">
              
                Credito inicial: R$ {maskMoneyToLocaleString(groupedOrderedHistorySum?.totalBalance.toFixed(2))}
</td>
<td align="left" valign="bottom">
                
</td>
<td align="left" valign="bottom">

                Debito inicial: R$ {maskMoneyToLocaleString(groupedOrderedHistorySum?.totalDebt.toFixed(2))}
</td>
<td align="left" valign="bottom">
                
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
                colSpan={5}
                align="left"
                valign="bottom"

              >
                <b>
                  <span>Tipo de Trasanção</span>
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
              groupedOrderedHistorySumDay.map((sum: any, sunIndex: number) => (

                groupedOrderedHistory.find((e: any) => e.key === sum.key)?.order.map((order: any, orderIndex: Number, orderArray: any[]) => (
                  <>

                    {orderIndex === 0 && <tr >

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

                      <td colSpan={5} align="left" valign="bottom">
                        <span color="#000000">
                          {order.transactionType}
                        </span>
                      </td>



                      <td
                        colSpan={2}
                        align="center"
                        valign="bottom">
                        <span color="#000000">
                          {order.dateAmountPaidHourAndMinute}
                        </span>
                      </td>

                      <td
                        colSpan={1}
                        align="right"
                        valign="bottom">
                        <span color="#000000">
                          R$ {maskMoneyToLocaleString(order.rechargeValue.toFixed(2))}
                        </span>
                      </td>


                    </tr>

                    {/* --- */}
                    {orderIndex === orderArray.length - 1 && <tr>

                      <td
                        style={{
                          borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={7}
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
                          borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={1}
                        align="right"
                        valign="bottom"
                      >
                        <b>
                        {groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.rechargeValue >= 0
                        ? (<span color="#000000">
                          R$  {maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.rechargeValue.toFixed(2))}
                          </span>)
                          :
                          (<span color="#000000">
                          - R$  {maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.rechargeValue.toFixed(2))}
                          </span>)
                        }
                        </b>
                      </td>

                      {/* <td
                        style={{
                          borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={1}
                        align="right"
                        valign="bottom"
                      >
                        <b>
                          <span color="#000000">
                            R$ {maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.commissionAmount.toFixed(2))}
                          </span>
                        </b>
                      </td> */}

                      {/* <td
                        style={{
                          borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={1}
                        align="right"
                        valign="bottom"
                      >
                        <b>
                          <span color="#000000">

                            R$ {maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.feeAmount.toFixed(2))}
                          </span>
                        </b>
                      </td> */}

                      {/* <td
                        style={{
                          borderTop: "1px solid rgb(67 33 132)",
                          borderBottom: "1px solid rgb(67 33 132)"
                        }}
                        colSpan={1}
                        align="right"
                        valign="bottom"
                      >
                        <b>
                          <span color="#000000">
                            R$ {maskMoneyToLocaleString(groupedOrderedHistorySumDay.find((e: any) => e.key === sum.key).order.netValue.toFixed(2))}
                          </span>
                        </b>
                      </td> */}
                    </tr>
                    }
                    {/* --- */}
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
                colSpan={7}
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

              {/* <td
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
                    R$ {groupedOrderedHistorySum && maskMoneyToLocaleString(groupedOrderedHistorySum?.commissionAmount.toFixed(2))}
                  </span>
                </b>
              </td> */}

              {/* <td
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
                    R$ {groupedOrderedHistorySum && maskMoneyToLocaleString(groupedOrderedHistorySum?.feeAmount.toFixed(2))}
                  </span>
                </b>
              </td> */}

              {/* <td
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
                    R$ {groupedOrderedHistorySum && maskMoneyToLocaleString(groupedOrderedHistorySum?.netValue.toFixed(2))}
                  </span>
                </b>
              </td> */}
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

export default FinancialStatement;
