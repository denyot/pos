package cn.longhaul.sap.system.aig;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import net.sf.json.JSONObject;

public abstract interface AigTransferInfo
{
  public abstract void appendTable(AigTransferTable paramAigTransferTable);

  public abstract AigTransferTable getTable(String paramString);

  public abstract AigTransferParameter getTransParameter();

  public abstract AigTransferParameter getImportPara();

  public abstract void setImportPara(AigTransferParameter paramAigTransferParameter);

  public abstract String getFunctionName();

  public abstract void setFunctionName(String paramString);

  public abstract ArrayList<AigTransferTable> getTableList();

  public abstract void setTableList(ArrayList<AigTransferTable> paramArrayList);

  public abstract AigTransferParameter getExportPara();

  public abstract void setExportPara(AigTransferParameter paramAigTransferParameter);

  public abstract ArrayList<HashMap<String, Object>> getAigTable(String paramString);

  public abstract ArrayList<JSONObject> getJSONAigTable(String paramString);

  public abstract JSONObject getJsonAigTalbeString(String paramString);

  public abstract Map<?, ?> getAigStructure(String paramString);

  public abstract Object getParameters(String paramString);

  public abstract String getExecuteResultInfo();

  public abstract void setExecuteResultInfo(String paramString);

  public abstract String getXmlAigTable(String paramString)
    throws Exception;
}