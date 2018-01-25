package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import com.caucho.hessian.client.HessianProxyFactory;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;

public class TransferInofClientTest
{
  public static void main(String[] args)
    throws Exception
  {
    String url = "http://127.0.0.1:8080/CHJ_G4/esb/hessian/sapTransferService";

    HessianProxyFactory factory = new HessianProxyFactory();
    factory.setUser("aig");
    factory.setPassword("password");
    SapTransfer transferservice = null;
    try {
      transferservice = (SapTransfer)factory.create(SapTransfer.class, url);
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      AigTransferTable rfctable = rfctransferinfo.getTable("IT_TEST");

      rfctable.setValue("WA", "hp");
      rfctable.setValue("IT1", "a1");
      rfctable.setValue("IT2", "b2");
      rfctable.appendRow();
      rfctable.setValue("WA", "hp2");
      rfctable.setValue("IT1", "a2");
      rfctable.setValue("IT2", "b2");
      rfctable.appendRow();

      HashMap useMap = new HashMap();
      useMap.put("WA", "testMP");
      useMap.put("IT1", "aMP");
      useMap.put("IT2", "bMP");
      rfctable.setTableValue(useMap);
      rfctable.appendRow();

      rfctransferinfo.appendTable(rfctable);

      rfctable = rfctransferinfo.getTable("IT_TEST1");

      rfctable.setValue("WA", "hp21");
      rfctable.setValue("IT1", "a21");
      rfctable.setValue("IT2", "b21");
      rfctable.appendRow();

      rfctable.setValue("WA", "hp22");
      rfctable.setValue("IT1", "b22");
      rfctable.setValue("IT2", "b22");
      rfctable.appendRow();

      rfctable.setValue("WA", "chp22");
      rfctable.setValue("IT1", "b22");
      rfctable.setValue("IT2", "b22");
      rfctable.appendRow();

      rfctransferinfo.appendTable(rfctable);

      AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();

      AigTransferStructure importstructure = rfcimport.getTransStructure("WA_TEST");

      importstructure.setValue("WA", "SWA1");
      importstructure.setValue("IT1", "SIT11");
      importstructure.setValue("IT2", "SIT12");
      rfcimport.appendStructure(importstructure);

      importstructure = rfcimport.getTransStructure("WA_TEST1");

      importstructure.setValue("WA", "SWA2");
      importstructure.setValue("IT1", "SIT12");
      importstructure.setValue("IT2", "SIT12");
      rfcimport.appendStructure(importstructure);

      rfcimport.setParameter("I_WERKS", "xxxxx");
      rfcimport.setParameter("I_WERKS2", "1");
      rfcimport.setParameter("I_PLIFZ", "34");
      rfcimport.setParameter("I_PLIFZ2", "22");

      rfctransferinfo.setImportPara(rfcimport);

      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_TEST", rfctransferinfo);
      System.out.println("返回信息传输对象:" + outinfo);

      System.out.println("得到输出参数U_WERKS：" + outinfo.getParameters("U_WERKS"));
      System.out.println("得到输出结构：" + outinfo.getAigStructure("U_RETURN"));
      System.out.println("得到输出表JSON类型：" + outinfo.getJSONAigTable("outinfo"));
      System.out.println("得到输出表：" + outinfo.getJsonAigTalbeString("IT_TEST"));
      System.out.println(outinfo.getXmlAigTable("IT_TEST1"));

      ArrayList resultinfo = outinfo.getAigTable("IT_TEST1");
      for (int i = 0; i < resultinfo.size(); i++) {
        HashMap resutlmap = (HashMap)resultinfo.get(i);
        System.out.println("输入出字段WA" + resutlmap.get("WA"));
        System.out.println("输入出字段IT1" + resutlmap.get("IT1"));
        System.out.println("输入出字段IT1" + resutlmap.get("IT2"));
      }

    }
    catch (MalformedURLException e)
    {
      e.printStackTrace();
    }
  }
}