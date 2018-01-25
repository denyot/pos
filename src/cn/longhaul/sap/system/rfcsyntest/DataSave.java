package cn.longhaul.sap.system.rfcsyntest;

import cn.longhaul.sap.system.datasyn.DataSynToAIGServiceImpl;

public class DataSave
{
  public static void main(String[] args)
    throws Exception
  {
    DataSynToAIGServiceImpl service = new DataSynToAIGServiceImpl();
    service.dataSyncToAigService("Z_RFC_STORE_05");
  }
}