package cn.longhaul.sap.service.impl;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.service.SapTransferService;
import cn.longhaul.sap.system.connection.ConnectionBase;
import cn.longhaul.sap.system.connection.SapConnection;
import cn.longhaul.sap.system.info.TransferAigInfo;
import com.sap.conn.jco.JCoFunction;
import org.eredlab.g4.bmf.base.BaseServiceImpl;

public class SapTransferServiceImpl extends BaseServiceImpl
  implements SapTransferService
{
  public TransferAigInfo getRfcInfo(String rfcName, String rfc_id)
  {
    TransferAigInfo rfcInfo = new TransferAigInfo();
    try
    {
      SapConnection connect = new SapConnection();
      JCoFunction function = connect.getFunction(rfcName);
      rfcInfo.setRfcname(function.getName());
      ConnectionBase ConnectionBase = new ConnectionBase();
      rfcInfo.setRfcImportParameterList(ConnectionBase.getParaList(function.getImportParameterList(), rfc_id));
      rfcInfo.setRfcExportParameterList(ConnectionBase.getParaList(function.getExportParameterList(), rfc_id));
      rfcInfo.setRfcChangingParameterList(ConnectionBase.getParaList(function.getChangingParameterList(), rfc_id));
      rfcInfo.setRfcTalbeParaMeterList(ConnectionBase.getTableList(function.getTableParameterList(), rfc_id));
      rfcInfo.setRfCExceptionList(ConnectionBase.getParaExceptions(function.getExceptionList(), rfc_id));
    } catch (LonghaulException e) {
      e.printStackTrace();
      rfcInfo = null;
    }
    return rfcInfo;
  }
}