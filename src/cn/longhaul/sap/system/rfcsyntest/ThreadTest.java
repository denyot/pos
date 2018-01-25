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

public class ThreadTest
  implements Runnable
{
  public void run()
  {
    String url = "http://192.168.0.212/chj/esb/hessian/sapTransferService";

    HessianProxyFactory factory = new HessianProxyFactory();
    factory.setUser("aig");
    factory.setPassword("password");
    SapTransfer transferservice = null;
    try {
      transferservice = (SapTransfer)factory.create(SapTransfer.class, url);
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      int pagesize = 10;
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
        outinfo = transferservice.transferInfoAig("Z_RFC_STORE2_01", rfctransferinfo);
        System.out.println("得到输出表：" + outinfo.getAigTable("IT_MARA").size());
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
      }while (lines >= pagesize);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  public static void main(String[] args)
  {
    ThreadTest test = new ThreadTest();
    Thread t1 = new Thread(test);
    t1.start();
    Thread t2 = new Thread(test);
    t2.start();

    Thread t3 = new Thread(test);
    t3.start();

    Thread t4 = new Thread(test);
    t4.start();

    Thread t5 = new Thread(test);
    t5.start();

    Thread t6 = new Thread(test);
    t6.start();

    Thread t7 = new Thread(test);
    t7.start();

    Thread t8 = new Thread(test);
    t8.start();

    Thread t9 = new Thread(test);
    t9.start();

    Thread t10 = new Thread(test);
    t10.start();
  }
}