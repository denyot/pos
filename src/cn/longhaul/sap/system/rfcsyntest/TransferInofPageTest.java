package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.db.RFCDataSaveServiceImpl;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TransferInofPageTest
{
  public static void main(String[] args)
    throws Exception
  {
    AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
    int pagesize = 4000;
    String currentdate = "19990101";
    AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
    rfcimport.setParameter("I_CURRDATE", currentdate);
    AigTransferStructure importstructure = rfcimport.getTransStructure("I_PAGES");
    importstructure.setValue("PAGESIZE", Integer.valueOf(pagesize));
    rfcimport.appendStructure(importstructure);
    rfctransferinfo.setImportPara(rfcimport);
    AigTransferInfo outinfo = null;
    int lines = 0;
    int pages = 1;
    do {
      long begin0 = System.currentTimeMillis();
      SapTransferImpl transferservice = new SapTransferImpl();
      outinfo = transferservice.transferInfoAig("Z_RFC_STORE2_03", rfctransferinfo);
      System.out.println("得到输出表：" + outinfo.getAigTable("IT_ZTBHD").size());
      List list = outinfo.getAigTable("IT_ZTBHD");
      RFCDataSaveServiceImpl service = new RFCDataSaveServiceImpl();

      System.out.println("得到输结构：" + outinfo.getAigStructure("U_PAGES"));

      HashMap outPageMap = (HashMap)outinfo.getAigStructure("U_PAGES");
      lines = Integer.valueOf(outPageMap.get("LINES").toString()).intValue();
      rfcimport = rfctransferinfo.getTransParameter();
      rfcimport.setParameter("I_CURRDATE", currentdate);
      importstructure = rfcimport.getTransStructure("I_PAGES");
      importstructure.setStructureMap(outPageMap);
      rfcimport.appendStructure(importstructure);
      rfctransferinfo.setImportPara(rfcimport);
      System.out.println("第(" + pages + ")页当前页" + lines + "条每次:" + pagesize + "条");
      pages++;
      long end0 = System.currentTimeMillis();
      System.out.println("整个执行耗时:" + (end0 - begin0) / 1000L + " 秒");
    }while (lines >= pagesize);
  }
}