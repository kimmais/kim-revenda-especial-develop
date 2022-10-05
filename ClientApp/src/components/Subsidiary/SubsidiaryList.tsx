import React, { Dispatch, useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { IStateType } from "../../store/models/root.interface";
import {
  ISubsidiary
} from "../../store/models/subsidiary.interface";

import services from "../../requester/services";
import requester from "../../requester/requester";
import {language} from "../../languages"

import MaterialTable from "material-table";
import MaterialTableIcons from "../../common/components/MaterialTableIcons";

import Edit from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import AddBoxIcon from '@material-ui/icons/AddBox';
import createTheme from "@material-ui/core/styles/createTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { maskCPF, maskPhoneNumber, maskCNPJ } from '../../Utils/mask.util';
import { addModal,removeModal } from "../../store/actions/modals.action";
import Modals from "../../common/components/Modal";


export type subjectListProps = {
  children?: React.ReactNode;
};

function SubsidiaryList(props: subjectListProps): JSX.Element {
  // const resellers: IResellerState = useSelector((state: IStateType) => state.resellers);
  const [subsidiary, setSubsidiary] = useState<ISubsidiary[]>([]);
  const dispatch: Dispatch<any> = useDispatch();
  const token = useSelector((state: IStateType) => state.account.token);
  let history = useHistory();
  const location:any = history.location;

  const resellerLanguage = language.reseller;

  let list = null;
  if (subsidiary !== null) {
    list = Array.from(subsidiary).map(d => {
      if(d.tableData){
        d.tableData.checked = false
      }
      return d
    });
  }
  
  let columns:any = [
    { title: resellerLanguage.id, field: "id", editable: "never" },
    { title: resellerLanguage.name, field: "name",editable: "never"  },
    { title: resellerLanguage.email, field: "email",editable: "never"  },
    {
      title: 'Suspenso',
      field: "status",
      type: "boolean",
      editable: "onUpdate",
      render: (rowData:any) => (
        rowData.status? <span style={{color:'#4caf50'}}>Não</span> : <span style={{color:'red'}} >Sim</span>
      ),
    },
    {
      title: 'Data de suspensão',
      field: "dateStatus",
      editable: "onUpdate",
      render: (rowData:any) => (
        <span style={{color:'red'}} >{rowData.dateStatus}</span>
      ),
    }
  ]

  const removeColumns = !location.state?.isAuthorizedResale? 'isActive':''
  columns = columns.filter((e:any) => e.field !== removeColumns)
   
  const getApiSubsidiary = async () => {
    try {

      const service = services.getUserSubsidiary;
      const account = { token: token };
      const [error, response]: any = await requester(account, service);
      setSubsidiary(response)
    } catch (error) {
      console.error(error);
    }
  };

  const updateSubsidiary = (item: any) => {

  const newSubsidiary = subsidiary.map((pr: any) =>
    Number(pr.id) === Number(item.id) ? item : pr
  )

  setSubsidiary(newSubsidiary)
  putApiSubsidiary(item.id,{status:item.status})

  };

  const putApiSubsidiary = async (id: string, body: object) => {
    try {
      // setLoader(true)
      const service = {
        ...services.putUserSubsidiary,
        endpoint: services.putUserSubsidiary.endpoint.replace("{{id}}", id),
      };
      const account = { token: token };
      const options = {
        data: body,
      };
      const [error]: any = await requester(account, service, options);
      if (!error) {

      } else {

      }
      return !error;
    } catch (error) {
      return false;
      console.error(error);
    }
  };

  useEffect(() => {
    getApiSubsidiary();
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
    <>
    <Modals />
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
      title="Lista de Entidades"
      localization={resellerLanguage.localization}
      editable={{
        onRowUpdate: async (newData, oldData) => {
            console.log(newData)
            dispatch(
              addModal(
                "Atenção",
                `Você confirma essa operação.`,
                'button',
                ()=> updateSubsidiary(newData)
              )
            );
            
        }
    }}
    actions={[
      {
          icon: AddBoxIcon,
          tooltip: 'Adicionar Revendedor',
          isFreeAction: true,
          onClick: (event: any) => {history.push(`/reseller/add`)}    
      }
  ]}
    />
    </MuiThemeProvider>
    </>
  );
}

export default SubsidiaryList;
