package cn.longhaul.sap.system.info;

import cn.longhaul.sap.system.Util.XmlConverUtil;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import net.sf.json.JSONObject;

public class TransferInfo
  implements AigTransferInfo, Serializable
{
  private static final long serialVersionUID = 1L;
  private String functionName;
  private AigTransferParameter importPara = new TransferParameter();

  private ArrayList<AigTransferTable> tableList = new ArrayList();

  private AigTransferParameter exportPara = new TransferParameter();
  private String executeResultInfo;

  public void appendTable(AigTransferTable table)
  {
    this.tableList.add(table);
  }

  public AigTransferParameter getImportPara()
  {
    return this.importPara;
  }

  public void setImportPara(AigTransferParameter ImportPara)
  {
    this.importPara = ImportPara;
  }

  public String getFunctionName()
  {
    return this.functionName;
  }

  public String getExecuteResultInfo()
  {
    return this.executeResultInfo;
  }

  public void setExecuteResultInfo(String executeResultInfo)
  {
    String crlf = System.getProperty("line.separator");
    this.executeResultInfo = (this.executeResultInfo + crlf + executeResultInfo);
  }

  public void setFunctionName(String functionName)
  {
    this.functionName = functionName;
  }

  public ArrayList<AigTransferTable> getTableList()
  {
    return this.tableList;
  }

  public void setTableList(ArrayList<AigTransferTable> tableList)
  {
    this.tableList = tableList;
  }

  public AigTransferParameter getExportPara()
  {
    return this.exportPara;
  }

  public void setExportPara(AigTransferParameter exportPara)
  {
    this.exportPara = exportPara;
  }

  public AigTransferTable getTable(String talbename)
  {
    return new TransferTable(talbename);
  }

  public AigTransferParameter getTransParameter()
  {
    return new TransferParameter();
  }

  public ArrayList<HashMap<String, Object>> getAigTable(String tableName)
  {
    ArrayList tableList = getTableList();
    ArrayList talbeconent = new ArrayList();
    for (int i = 0; i < tableList.size(); i++) {
      String gettableName = ((AigTransferTable)tableList.get(i)).getName();

      if (gettableName.equals(tableName)) {
        talbeconent = ((AigTransferTable)tableList.get(i)).getMetaData();
        break;
      }
    }
    return talbeconent;
  }

  public ArrayList<JSONObject> getJSONAigTable(String tableName)
  {
    ArrayList tableList = getTableList();
    ArrayList talbeconent = new ArrayList();
    ArrayList jsonArrayList = new ArrayList();
    for (int i = 0; i < tableList.size(); i++) {
      String gettableName = ((AigTransferTable)tableList.get(i)).getName();
      talbeconent = ((AigTransferTable)tableList.get(i)).getMetaData();
      if (gettableName.equals(tableName)) {
        talbeconent = ((AigTransferTable)tableList.get(i)).getMetaData();
        for (int j = 0; j < talbeconent.size(); j++) {
          jsonArrayList.add(JSONObject.fromObject(talbeconent.get(j)));
        }
      }
    }

    return jsonArrayList;
  }

  public JSONObject getJsonAigTalbeString(String tableName)
  {
    JSONObject jsonObj = null;
    ArrayList tableList = getTableList();
    for (int i = 0; i < tableList.size(); i++) {
      String gettableName = ((AigTransferTable)tableList.get(i)).getName();
      ArrayList tableconect = ((AigTransferTable)tableList.get(i)).getMetaData();
      if (gettableName.equals(tableName)) {
        tableconect = ((AigTransferTable)tableList.get(i)).getMetaData();
        Map map = new HashMap();
        map.put("totalNum", Integer.valueOf(tableconect.size()));
        map.put("resultList", tableconect);
        jsonObj = JSONObject.fromObject(map);
      }
    }
    return jsonObj;
  }

  public Map<?, ?> getAigStructure(String structcturename)
  {
    AigTransferParameter outpara = getExportPara();
    Map structuresMap = null;
    ArrayList list = outpara.getStructureList();
    for (int l = 0; l < list.size(); l++) {
      AigTransferStructure struts = (AigTransferStructure)list.get(l);
      if (structcturename.equals(struts.getStructureName())) {
        structuresMap = struts.getStructureMap();
        break;
      }
    }
    return structuresMap;
  }

  public Object getParameters(String paraName)
  {
    return getExportPara().getParameters().get(paraName.trim());
  }

  public String getXmlAigTable(String tableName)
    throws Exception
  {
    String xmStr = "";
    ArrayList tableList = getTableList();
    for (int i = 0; i < tableList.size(); i++) {
      String gettableName = ((AigTransferTable)tableList.get(i)).getName();
      ArrayList tableconect = ((AigTransferTable)tableList.get(i)).getMetaData();
      if (gettableName.equals(tableName)) {
        xmStr = XmlConverUtil.listtoXml(tableconect);
      }
    }
    return xmStr;
  }
}