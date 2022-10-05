import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Modals from "../../common/components/Modal";
import "./Reports.css";

const Reports: React.FC = () => {
  return (
    <Fragment>
      <div className="card shadow padding">
      <div className="card-header-detail py-3">
              <h6 className="m-0 card-header-detail-title">
                Relatório
              </h6>
      </div>
      <div className="card_report_box">
        <Link to="reports/salesByPeriod" className="card card_report">
          <div className="card_report_icon">
            <i className="fas fa-fw fa-file-alt"></i>
          </div>
          <div className="card_report_title">
            <span>Relatório de vendas por período</span>
          </div>
        </Link>

        <Link to="reports/orderListage" className="card card_report">
          <div className="card_report_icon">
            <i className="fas fa-fw fa-file-alt"></i>
          </div>
          <div className="card_report_title">
            <span>Relatório de listagem de pedidos</span>
          </div>
        </Link>


        <Link to="/reports/orderAuditReport" className="card card_report">
          <div className="card_report_icon">
            <i className="fas fa-fw fa-file-alt"></i>
          </div>
          <div className="card_report_title">
            <span>Relatorio de Auditoria de Pedido</span>
          </div>
        </Link>

        <Link to="/reports/financialStatement" className="card card_report">
          <div className="card_report_icon">
            <i className="fas fa-fw fa-file-alt"></i>
          </div>
          <div className="card_report_title">
            <span>Relatorio de Extrato Financeiro por Período</span>
          </div>
        </Link>

      </div>
      </div>
      <Modals />
    </Fragment>
  );
};

export default Reports;
