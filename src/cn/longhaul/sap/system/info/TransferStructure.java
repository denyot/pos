package cn.longhaul.sap.system.info;

import cn.longhaul.sap.system.aig.AigTransferStructure;
import java.io.Serializable;
import java.util.HashMap;

public class TransferStructure
  implements AigTransferStructure, Serializable
{
  private static final long serialVersionUID = 6811560454268341532L;
  private String structureName;
  private HashMap<String, Object> structureMap = new HashMap();

  public TransferStructure()
  {
  }

  public TransferStructure(String structureName)
  {
    this.structureName = structureName;
  }

  public void setValue(String key, Object value)
  {
    this.structureMap.put(key, value);
  }

  public String getStructureName()
  {
    return this.structureName;
  }
  public void setStructureName(String structureName) {
    this.structureName = structureName;
  }

  public HashMap<String, Object> getStructureMap()
  {
    return this.structureMap;
  }

  public void setStructureMap(HashMap<String, Object> structureMap)
  {
    this.structureMap = structureMap;
  }
}