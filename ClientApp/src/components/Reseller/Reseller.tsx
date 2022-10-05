import React, { Fragment, Dispatch } from "react";
import ResellerList from "./ResellerList";
import "./Reseller.css";
import Modals from "../../common/components/Modal";

const Reseller: React.FC = () => {
  
  return (
    <Fragment>
      <ResellerList  />
      <Modals />
    </Fragment>
  );
};

export default Reseller;
