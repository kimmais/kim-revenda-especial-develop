import React from "react";
import TopMenuAccount from "./TopMenuAccount";
import "./TopMenu.css";
import { useSelector } from "react-redux";
import { IStateType, IRootPageStateType } from "../../store/models/root.interface";

const TopMenu: React.FC = () => {
  const page: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const {email , token, name, id} = useSelector((state: IStateType) => state.account);
  return (
    <nav className="navbar navbar-expand navbar-light bg-custom-dark topbar mb-4 static-top shadow">
      {/* <ol className="breadcrumb dark-breadcrumb">
        <li className="breadcrumb-item"><a href="# ">{page ? page.area : null}</a></li>
        <li className="breadcrumb-item"><a href="# ">{page ? page.subArea : null}</a></li>
      </ol> */}
        <span className="mr-2 d-none d-lg-inline small cadet big-text">{id}: {name}</span>
      <ul className="navbar-nav ml-auto">
        <div className="topbar-divider d-none d-sm-block"></div>
        <TopMenuAccount />
      </ul>
    </nav>
  );
};

export default TopMenu;
