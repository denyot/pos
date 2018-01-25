package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.connection.ConnectionBase;
import cn.longhaul.sap.system.connection.SapConnection;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferAigInfo;
import cn.longhaul.sap.system.info.TransferInfo;
import cn.longhaul.sap.system.info.TransferParameter;
import cn.longhaul.sap.system.info.TransferStructure;
import cn.longhaul.sap.system.info.TransferTable;
import com.sap.conn.jco.JCoFunction;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;

public class RfcTransfer
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
      rfctransferinfo.setFunctionName("Z_RFC_TEST");
      AigTransferTable table = new TransferTable();

      table.setName("IT_TEST");
      table.setValue("WA", "hp7");
      table.setValue("IT1", "a1");
      table.setValue("IT2", "a2");
      table.appendRow();

      table.setValue("WA", "hp8");
      table.setValue("IT1", "b5");
      table.setValue("IT2", "b6");
      table.appendRow();
      rfctransferinfo.appendTable(table);

      table = new TransferTable();
      table.setName("IT_TEST1");

      table.setValue("WA", "hp`");
      table.setValue("IT1", "a1");
      table.setValue("IT2", "a2");
      table.appendRow();

      table.setValue("WA", "hp10");
      table.setValue("IT1", "b5");
      table.setValue("IT2", "b6");
      table.appendRow();
      rfctransferinfo.appendTable(table);

      AigTransferParameter rfcimport = new TransferParameter();
      TransferStructure importstructure = new TransferStructure();
      importstructure.setStructureName("WA_TEST");
      importstructure.setValue("WA", "123");
      importstructure.setValue("IT1", "34");
      importstructure.setValue("IT2", "xx");
      rfcimport.appendStructure(importstructure);

      importstructure = new TransferStructure();
      importstructure.setStructureName("WA_TEST1");
      importstructure.setValue("WA", "1");
      importstructure.setValue("IT1", "3x");
      importstructure.setValue("IT2", "4");
      rfcimport.appendStructure(importstructure);

      rfcimport.setParameter("I_WERKS", "xxxxx");
      rfcimport.setParameter("I_WERKS2", "mytsteeee");
      rfctransferinfo.setImportPara(rfcimport);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_TEST", rfctransferinfo);

      System.out.println(out.getExportPara().getParameters().get("U_WERKS"));
      AigTransferTable outtalbe = (AigTransferTable)out.getTableList().get(0);
      System.out.println(((HashMap)outtalbe.getMetaData().get(0)).get("WA") + "PPP");
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
}