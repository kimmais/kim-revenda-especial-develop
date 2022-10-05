import React, { forwardRef }  from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import Star from "@material-ui/icons/Star";
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import List from '@material-ui/icons/List';

const styles = {
  positive:{
    color: '#4caf50'
  },
  negative:{ 
    color: '#rgb(59, 59, 59)'
   }
}

const MaterialTableIcons = {
    Add: forwardRef((props, ref) => <div style={{fontSize: 16}}><AddBox {...props} ref={ref} /> Inserir número cartão</div>),
    Check: forwardRef((props, ref) => <Check style={styles.positive} {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear style={styles.negative} {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove style={{color: 'red'}} {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    //custom
    CheckBox: forwardRef((props, ref) => <CheckBox style={styles.positive} {...props} ref={ref} />),
    CheckBoxOutlineBlank: forwardRef((props, ref) => <CheckBoxOutlineBlank style={styles.negative} {...props} ref={ref} />),
    Star: forwardRef((props, ref) => <Star style={styles.positive} {...props} ref={ref} />),
    StarBorderOutlined: forwardRef((props, ref) => <StarBorderOutlined style={styles.negative} {...props} ref={ref} />),
    List: forwardRef((props, ref) => <List style={styles.negative} {...props} ref={ref} />)
  };

  export default MaterialTableIcons;