import React, { Dispatch, useEffect,Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { IStateType, IResellerState } from "../../store/models/root.interface";
import {
  getResellerState,
} from "../../store/actions/resellers.actions";
import {
  IReseller
} from "../../store/models/reseller.interface";

import services from "../../requester/services";
import requester from "../../requester/requester";
import {language} from "../../languages"

import MaterialTable from "material-table";
import MaterialTableIcons from "../../common/components/MaterialTableIcons";

import AddBoxIcon from '@material-ui/icons/AddBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Edit from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import createTheme from "@material-ui/core/styles/createTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { maskCPF, maskPhoneNumber, maskCNPJ } from '../../Utils/mask.util';
import { addModal, removeModal } from "../../store/actions/modals.action";


export type subjectListProps = {
  children?: React.ReactNode;
};

function ResellerList(props: subjectListProps): JSX.Element {
  const resellers: IResellerState = useSelector((state: IStateType) => state.resellers);
  const dispatch: Dispatch<any> = useDispatch();
  const token = useSelector((state: IStateType) => state.account.token);
  let history = useHistory();
  const location:any = history.location;

  const resellerLanguage = language.reseller;

  let list = null;
  if (resellers.resellers !== null) {
    list = Array.from(resellers.resellers).map(d => {
      if(d.tableData){
        d.tableData.checked = false
      }
      d.cpfOrCnpj = d.cpf?maskCPF(d.cpf):maskCNPJ(d.cnpj)
      d.phoneComplete = `(${d.areaCode}) ${maskPhoneNumber(d.cellPhone)}`
      return d
    });
  }

  let columns:any = [
    { title: resellerLanguage.id, field: "id" },
    { title: resellerLanguage.cpfOrCnpj, field: "cpfOrCnpj" },
    { title: resellerLanguage.name, field: "name" },
    { title: resellerLanguage.cellPhone, field: "phoneComplete" },
    { title: resellerLanguage.email, field: "email" },
    {
      title: 'Ativo',
      field: "isActive",
      type: "boolean",
      editable: "onUpdate",
      render: (rowData:any) => (
        rowData.isActive? <MaterialTableIcons.Check /> : <MaterialTableIcons.ThirdStateCheck  /> 
      ),
    }
  ]

  const removeColumns = !location.state?.isAuthorizedResale? 'isActive':''
  columns = columns.filter((e:any) => e.field !== removeColumns)
   
  const getApiReseller = async () => {
    try {

      const service = {
        ...services.getReseller,
        endpoint: services.getReseller.endpoint.replace("{{status}}", location.state?.isAuthorizedResale||false),
      };
      const account = { token: token };
      const [error, response]: any = await requester(account, service);
      dispatch(getResellerState(response));
    } catch (error) {
      console.error(error);
    }
  };

  const putApiResellerPassword = async (id:number) => {
    try {

      const service = {
        ...services.putPassword,
        endpoint: services.putPassword.endpoint.replace("{{id}}", id),
      };
      const account = { token: token };
      const [error, response]: any = await requester(account, service);
      dispatch( addModal(
        "Atenção",
        `A senha foi enviada com sucesso !`,
        "ok",
        () => null
      ))
    } catch (error) {
      dispatch( addModal(
        "Atenção",
        `Não foi possível enviar a senha por favor entre em contato com a equipe técnica.`,
        "ok",
        () => null
      ))
    }
  };


  useEffect(() => {
    getApiReseller();
  }, []);

  const theme = createTheme({
    overrides: {
      MuiCheckbox: {
        root: {
            padding: '5px',
        },
        colorSecondary: {
          // color: '#E74040',
            '&$checked': {
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
        main: '#4caf50',
      },
      secondary: {
        main: '#432184' ,
      }
  
    },

  });

  return (
    <Fragment>
    <MuiThemeProvider theme={theme}>
    <MaterialTable
      icons={MaterialTableIcons}
      columns={columns||[]}
      data={list || []}
      options={{
        filtering: true,
        columnsButton: false,
        search: false,
        rowStyle: data => {
          // console.log(data)
        return data.tableData.id % 2
          ? { background: "#F1F0FF" }
          : { background: "white" }
        }
      }}
      title={`Entidades`}
      localization={resellerLanguage.localization}
      actions={[
        {
          icon: Edit,
          tooltip: 'Editar',
          position: 'row',
          onClick: (event, data:any ) => {
            history.push(`/reseller/${data.id}`,{...data})
          },
        },
        {
          icon: DescriptionIcon,
          tooltip: 'Relatório',
          position: 'row',
          hidden:!location.state?.isAuthorizedResale,
          onClick: (event, data:any ) => {
            history.push(`reports/salesReseller`,{...data})
          }, 
        },
        {
          icon: VpnKeyIcon,
          tooltip: 'Reenviar senha',
          position: 'row',
          // hidden:!location.state?.isAuthorizedResale,
          onClick: (event, data:any ) => {
            dispatch( addModal(
              "Atenção",
              `Deseja reenviar a senha?`,
              "button",
              () => putApiResellerPassword(data.id)
            ))
            // history.push(`reports/salesReseller`,{...data})
          }, 
        },
        {
          icon: AddBoxIcon,
          tooltip: 'Adicionar Revendedor',
          isFreeAction: true,
          onClick: (event) => {history.push(`/reseller/add`)}
        }
      ]}
    />
    
    </MuiThemeProvider>
    
    </Fragment>
  );
}

export default ResellerList;
