package cn.longhaul.sap.system.connection;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.info.TransferAigInfo;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoListMetaData;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoTable;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class ConnectionTester
{
  public static void main1(String[] args)
    throws LonghaulException
  {
    System.out.println("begin 1");
    System.out.println(new Date());

    SapConnection connect = new SapConnection();
    System.out.println("begin 2");
    System.out.println(new Date());
    JCoFunction function = connect.getFunction("BAPI_USER_GETLIST");
    function.getImportParameterList().setValue("MAX_ROWS", 2);
    connect.execute(function);
    System.out.println("begin 3");
    System.out.println(new Date());
    JCoTable table = function.getTableParameterList().getTable("USERLIST");
    System.out.println("Number of Users 1: " + table.getNumRows());
    for (int i = 0; i < table.getNumRows(); i++)
    {
      String s = table.getValue("USERNAME").toString();
      System.out.println(s);
      table.nextRow();
    }
    System.out.println("begin 4");
    System.out.println(new Date());
    function = connect.getFunction("BAPI_USER_GETLIST");
    function.getImportParameterList().setValue("MAX_ROWS", 10);
    connect.execute(function);
    table = function.getTableParameterList().getTable("USERLIST");
    System.out.println("Number of Users 2: " + table.getNumRows());
    for (int i = 0; i < table.getNumRows(); i++)
    {
      String s = table.getValue("USERNAME").toString();
      System.out.println(s);
      table.nextRow();
    }

    System.out.println("begin 5");
    System.out.println(new Date());
    function = connect.getFunction("BAPI_USER_GETLIST");
    function.getImportParameterList().setValue("MAX_ROWS", 20);
    connect.execute(function);
    table = function.getTableParameterList().getTable("USERLIST");
    System.out.println("Number of Users 3: " + table.getNumRows());
    for (int i = 0; i < table.getNumRows(); i++)
    {
      String s = table.getValue("USERNAME").toString();
      System.out.println(s);
      table.nextRow();
    }

    System.out.println("end ");
    System.out.println(new Date());
  }

  public static void main(String[] args)
    throws LonghaulException
  {
    System.out.println("begin 1");
    System.out.println(new Date());
    SapConnection connect = new SapConnection();
    JCoFunction function = connect.getFunction("Z_RFC_TEST");
    TransferAigInfo rfcInfo = new TransferAigInfo();
    function.getImportParameterList();

    String rfc_id = "001002001004";
    rfcInfo.setRfcname(function.getName());
    ConnectionBase ConnectionBase = new ConnectionBase();
    rfcInfo.setRfcImportParameterList(ConnectionBase.getParaList(function.getImportParameterList(), rfc_id));

    rfcInfo.setRfcExportParameterList(ConnectionBase.getParaList(function.getExportParameterList(), rfc_id));
    rfcInfo.setRfcChangingParameterList(ConnectionBase.getParaList(function.getChangingParameterList(), rfc_id));
    rfcInfo.setRfcTalbeParaMeterList(ConnectionBase.getTableList(function.getTableParameterList(), rfc_id));
    rfcInfo.setRfCExceptionList(ConnectionBase.getParaExceptions(function.getExceptionList(), rfc_id));

    System.out.println("OK");
    JCoListMetaData test = function.getTableParameterList().getListMetaData();

    ArrayList importpara = rfcInfo.getRfcImportParameterList();
    for (int i = 0; i < importpara.size(); i++) {
      HashMap localHashMap1 = (HashMap)importpara.get(i);
    }

    ArrayList emportpara = rfcInfo.getRfcExportParameterList();
    for (int i = 0; i < emportpara.size(); i++) {
      HashMap localHashMap2 = (HashMap)emportpara.get(i);
    }

//    ArrayList tablepara = rfcInfo.getRfcTalbeParaMeterList();
//    for (int j = 0; j < tablepara.size(); j++)
//      HashMap localHashMap3 = (HashMap)tablepara.get(j);
  }
}