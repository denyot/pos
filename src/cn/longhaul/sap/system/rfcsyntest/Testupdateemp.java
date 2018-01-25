package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.eredlab.g4.ccl.util.G4Utils;

public class Testupdateemp
{
  public static void main(String[] args)
  {
    try
    {
      Map str44 = new HashMap();
      str44.put("ERDAT", G4Utils.getCurrentTime("yyyyMMdd"));
      str44.put("ERZET", G4Utils.getCurrentTime("HHmmss"));
      int next = new Random().nextInt(50000);
      str44.put("POSID", "45465465" + next);
      str44.put("KUNNR", "1204024");

      Map strxx = new HashMap();
      strxx.put("KUNNR", "1204024");
      strxx.put("STCD1", G4Utils.getCurrentTime("yyyyMMdd"));
      strxx.put("NAME1", "1555556666");

      AigTransferInfo rfctransferinfo1 = AigRepository.getTransferInfo();
      AigTransferStructure structure44 = rfctransferinfo1.getImportPara().getTransStructure("I_ZTSTORE2_44");
      AigTransferStructure structurexx = rfctransferinfo1.getImportPara().getTransStructure("I_HYXX");
      structure44.getStructureMap().putAll(str44);
      structurexx.getStructureMap().putAll(strxx);

      rfctransferinfo1.getImportPara().appendStructure(structure44);
      rfctransferinfo1.getImportPara().appendStructure(structurexx);
      SapTransferImpl transfer1 = new SapTransferImpl();
      AigTransferInfo outinfo = transfer1.transferInfoAig("Z_RFC_STORE2_44", rfctransferinfo1);

      if ("S".equals(outinfo.getAigStructure("U_RETURN").get("TYPE")))
        System.out.println("success");
      else
        System.out.println("fail!!");
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }
}