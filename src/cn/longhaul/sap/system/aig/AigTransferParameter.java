package cn.longhaul.sap.system.aig;

import java.util.ArrayList;
import java.util.HashMap;

public abstract interface AigTransferParameter
{
  public abstract void appendStructure(AigTransferStructure paramAigTransferStructure);

  public abstract AigTransferStructure getTransStructure(String paramString);

  public abstract void setParameter(String paramString, Object paramObject);

  public abstract ArrayList<AigTransferStructure> getStructureList();

  public abstract void setStructureList(ArrayList<AigTransferStructure> paramArrayList);

  public abstract HashMap<String, Object> getParameters();

  public abstract void setParameters(HashMap<String, Object> paramHashMap);
}