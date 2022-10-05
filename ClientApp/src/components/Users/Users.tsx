import React, { Fragment, Dispatch } from "react";
import TopCard from "../../common/components/TopCard";
import { IUser } from "../../store/models/user.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { addAdmin, removeAdmin } from "../../store/actions/users.action";
import { updateCurrentPath } from "../../store/actions/root.actions";

const Users: React.FC = () => {


  return (
    <Fragment>

     </Fragment >
  );
};

export default Users;
