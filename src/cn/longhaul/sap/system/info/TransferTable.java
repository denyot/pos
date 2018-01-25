package cn.longhaul.sap.system.info;

import cn.longhaul.sap.system.aig.AigTransferTable;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

public class TransferTable
  implements AigTransferTable, Serializable
{
  private static final long serialVersionUID = 2807897344923010381L;
  private String name;
  private HashMap<String, Object> tableValue = new HashMap();

  private ArrayList<HashMap<String, Object>> metaData = new ArrayList();

  public TransferTable()
  {
  }

  public TransferTable(String name)
  {
    this.name = name;
  }

  public void setValue(String key, Object value)
  {
    this.tableValue.put(key, value);
  }

  public void appendRow()
  {
    this.metaData.add(this.tableValue);
    this.tableValue = new HashMap();
  }

  public String getName() {
    return this.name;
  }

  public HashMap<String, Object> getTableValue() {
    return this.tableValue;
  }

  public void setTableValue(HashMap<String, Object> tableValue) {
    this.tableValue = tableValue;
  }

  public ArrayList<HashMap<String, Object>> getMetaData()
  {
    return this.metaData;
  }

  public void setMetaData(ArrayList<HashMap<String, Object>> metaData)
  {
    this.metaData = metaData;
  }

  public void setName(String name) {
    this.name = name;
  }
}