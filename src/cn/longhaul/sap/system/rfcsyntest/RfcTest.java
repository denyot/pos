package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.connection.ConnectionBase;
import cn.longhaul.sap.system.connection.SapConnection;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferAigInfo;
import cn.longhaul.sap.system.info.TransferInfo;
import com.sap.conn.jco.JCoFunction;
import java.io.PrintStream;

public class RfcTest
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
    }
    catch (LonghaulException e) {
      e.printStackTrace();

      rfcInfo = null;
    }
    return rfcInfo;
  }

  public static void main(String[] args)
  {
    try {
      AigTransferInfo rfctransferinfo = new TransferInfo();

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_06", rfctransferinfo);

      System.out.println(out);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
}