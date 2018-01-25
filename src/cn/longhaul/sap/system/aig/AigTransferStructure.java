package cn.longhaul.sap.system.aig;

import java.util.HashMap;

public abstract interface AigTransferStructure
{
  public abstract void setValue(String paramString, Object paramObject);

  public abstract String getStructureName();

  public abstract void setStructureName(String paramString);

  public abstract HashMap<String, Object> getStructureMap();

  public abstract void setStructureMap(HashMap<String, Object> paramHashMap);
}