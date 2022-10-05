import React, { Fragment } from "react";
import LeftMenu from "../LeftMenu/LeftMenu";
import TopMenu from "../TopMenu/TopMenu";
import { Switch, Route } from "react-router";
import Home from "../Home/Home";
import Notifications from "../../common/components/Notification";
import Reports from "../Reports/Reports";
import SalesByPeriod from "../Reports/SalesByPeriod";

import OrderListage from "../Reports/OrderListage";
import OrderAuditReport from "../Reports/OrderAuditReport";
import FinancialStatement from "../Reports/FinancialStatement";

import OrderCreate from "../Order/OrderCreate"
import OrderHistoric from "../Order/OrderHitoric"
import NewPassword from "../Account/NewPassword";

import Connect from "../CardTransport/Connect";
import SubsidiaryList from "../Subsidiary/SubsidiaryList";

import Reseller from "../Reseller/Reseller"
import ResellerAdd from "../Reseller/ResellerAdd";
import ResellerEdit from "../Reseller/ResellerEdit";


const Admin: React.FC = () => {

  return (
    <Fragment>
      <Notifications />
      <LeftMenu />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopMenu />
          <div className="container-fluid">
            <Switch>
              <Route path={`/account/newPassword`}><NewPassword /></Route>
              <Route exact path={`/reports`}><Reports /></Route>
              <Route exact path={`/reports/salesByPeriod`}><SalesByPeriod /></Route>
              <Route exact path={`/reports/orderListage`}><OrderListage /></Route>
              <Route exact path={`/reports/orderAuditReport`}><OrderAuditReport /></Route>
              <Route exact path={`/reports/FinancialStatement`}><FinancialStatement /></Route>
              <Route exact path={`/order/orderCreate`}><OrderCreate /></Route>
              <Route exact path={`/order/historic`}><OrderHistoric /></Route>
              <Route exact path={`/cardTransport/connect`}><Connect /></Route>
              <Route exact path={`/subsidiary/subsidiaryList`}><SubsidiaryList /></Route>
              <Route exact path={`/reseller/add`}><ResellerAdd /></Route>
              <Route exact path={`/reseller/:id`}><ResellerEdit /></Route>
              <Route exact path={`/reseller`}><Reseller /></Route>
              <Route path="/"><Home /></Route>
              
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
