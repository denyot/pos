package cn.longhaul.sap.syncbase;

import java.util.HashMap;

public class RfcInputStructure
{
  private String inputStructurename;
  private HashMap<?, ?> structurMap;

  public HashMap<?, ?> getStructurMap()
  {
    return this.structurMap;
  }
  public void setStructurMap(HashMap<?, ?> structurMap) {
    this.structurMap = structurMap;
  }
  public String getInputStructurename() {
    return this.inputStructurename;
  }
  public void setInputStructurename(String inputStructurename) {
    this.inputStructurename = inputStructurename;
  }
}