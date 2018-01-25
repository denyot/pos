package cn.longhaul.sap.syncbase;

import java.util.ArrayList;

public class RfcTable
{
  private String tablename;
  private ArrayList<?> table;
  private String aigtablename;
  private ArrayList<?> rfctableinfo;
  private RfcTable sonTable;

  public String getTablename()
  {
    return this.tablename;
  }

  public void setTablename(String inputTablename) {
    this.tablename = inputTablename;
  }

  public String getAigtablename() {
    if (this.aigtablename == null) {
      this.aigtablename = this.tablename;
    }
    return this.aigtablename;
  }

  public void setAigtablename(String aigtablename) {
    this.aigtablename = aigtablename;
  }

  public ArrayList<?> getTable() {
    if (this.table == null) {
      this.table = new ArrayList();
    }
    return this.table;
  }

  public void setTable(ArrayList<?> inputTable) {
    this.table = inputTable;
  }

  public ArrayList<?> getRfcTableinfo() {
    return this.rfctableinfo;
  }

  public void setRfcTableInfo(ArrayList<?> rfctableinfo) {
    this.rfctableinfo = rfctableinfo;
  }

  public RfcTable getSonTable()
  {
    return this.sonTable;
  }

  public void setSonTable(RfcTable sonTable)
  {
    this.sonTable = sonTable;
  }
}