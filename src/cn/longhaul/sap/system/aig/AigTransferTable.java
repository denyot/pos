package cn.longhaul.sap.system.aig;

import java.util.ArrayList;
import java.util.HashMap;

public abstract interface AigTransferTable
{
  public abstract void appendRow();

  public abstract void setValue(String paramString, Object paramObject);

  public abstract String getName();

  public abstract void setName(String paramString);

  public abstract HashMap<String, Object> getTableValue();

  public abstract void setTableValue(HashMap<String, Object> paramHashMap);

  public abstract ArrayList<HashMap<String, Object>> getMetaData();

  public abstract void setMetaData(ArrayList<HashMap<String, Object>> paramArrayList);
}