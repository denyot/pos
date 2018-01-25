package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import com.caucho.hessian.client.HessianProxyFactory;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;

public class TransferInofWebPageTest
{
  public static void test(String[] args)
    throws Exception
  {
    String url = "http://192.168.0.236/CHJ_G4/esb/hessian/sapTransferService";

    HessianProxyFactory factory = new HessianProxyFactory();
    factory.setUser("aig");
    factory.setPassword("password");
    SapTransfer transferservice = null;
    try {
      transferservice = (SapTransfer)factory.create(SapTransfer.class, url);
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      int pagesize = 1000;
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
        outinfo = transferservice.transferInfoAig("Z_RFC_STORE2_03", rfctransferinfo);
        System.out.println("得到输出表：" + outinfo.getAigTable("IT_ZTBHD").size());

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
        System.out.println("执行耗时:" + (end0 - begin0) / 1000L + " 豪秒");
      }while (lines >= pagesize);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
}