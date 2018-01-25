package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import com.caucho.hessian.client.HessianProxyFactory;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;

public class TransferInofClientTestZSD003
{
  public static void main(String[] args)
    throws Exception
  {
    String url = "http://192.168.0.212/chj/esb/hessian/sapTransferService";

    HessianProxyFactory factory = new HessianProxyFactory();
    factory.setUser("aig");
    factory.setPassword("password");
    SapTransfer transferservice = null;
    try {
      transferservice = (SapTransfer)factory.create(SapTransfer.class, url);
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      AigTransferTable rfctable = rfctransferinfo.getTable("S_AUDAT");

      rfctable.setValue("SIGN", "I");
      rfctable.setValue("OPTION", "BT");
      rfctable.setValue("LOW", "20120501");
      rfctable.setValue("HIGH", "20120510");
      rfctable.appendRow();

      rfctransferinfo.appendTable(rfctable);

      rfctable = rfctransferinfo.getTable("S_WERKS");

      rfctable.setValue("SIGN", "I");
      rfctable.setValue("OPTION", "EQ");
      rfctable.setValue("LOW", "02ST");
      rfctable.setValue("HIGH", "");
      rfctable.appendRow();

      rfctransferinfo.appendTable(rfctable);

      AigTransferInfo outinfo = transferservice.transferInfoAig("Z_RFC_STORE2_ZSD003", rfctransferinfo);
      System.out.println("返回信息传输对象:" + outinfo);

      System.out.println("得到输出参数U_WERKS：" + outinfo.getParameters("U_WERKS"));
      System.out.println("得到输出结构：" + outinfo.getAigStructure("U_RETURN"));
      System.out.println("得到输出表S_AUDAT.JSON类型：" + outinfo.getJSONAigTable("S_AUDAT"));
      System.out.println("得到输出表S_WERKS.JSON类型：" + outinfo.getJSONAigTable("S_WERKS"));
      System.out.println("得到输出表GT_ITEM.JSON类型：" + outinfo.getJSONAigTable("GT_ITEM"));
      System.out.println("得到输出表IT_RETURN.JSON类型：" + outinfo.getJSONAigTable("IT_RETURN"));
      System.out.println(outinfo.getXmlAigTable("IT_RETURN"));

      ArrayList resultinfo1 = outinfo.getAigTable("S_AUDAT");
      ArrayList resultinfo2 = outinfo.getAigTable("S_WERKS");
      ArrayList resultinfo3 = outinfo.getAigTable("GT_ITEM");
      ArrayList resultinfo4 = outinfo.getAigTable("IT_RETURN");

      System.out.println(resultinfo1.size());
      System.out.println(resultinfo2.size());
      System.out.println("GT_ITEM:" + resultinfo3.size());
      System.out.println(resultinfo4.size());

      for (int i = 0; i < resultinfo3.size(); i++) {
        HashMap resutlmap = (HashMap)resultinfo3.get(i);
        System.out.println("输入出字段WA" + resutlmap.get("ZHLHXT"));
        System.out.println("输入出字段IT1" + resutlmap.get("F_KWMENG"));
        System.out.println("输入出字段IT1" + resutlmap.get("F_JSZB"));
        System.out.println("输入出字段IT1" + resutlmap.get("F_KZWI2"));
        System.out.println("输入出字段IT1" + resutlmap.get("F_JEZB"));
        System.out.println("输入出字段IT1" + resutlmap.get("L_KWMENG"));
        System.out.println("输入出字段IT1" + resutlmap.get("L_JSZB"));
        System.out.println("输入出字段IT1" + resutlmap.get("L_KZWI2"));
        System.out.println("输入出字段IT1" + resutlmap.get("L_JEZB"));
        System.out.println("输入出字段IT1" + resutlmap.get("ZJSCE"));
        System.out.println("输入出字段IT1" + resutlmap.get("ZJECE"));
        System.out.println("输入出字段IT1" + resutlmap.get("ZYSBZ"));
      }

    }
    catch (MalformedURLException e)
    {
      e.printStackTrace();
    }
  }
}