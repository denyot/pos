package cn.longhaul.sap.syncbase;

import java.util.ArrayList;

public class RfcOutStands
{
  private String name;
  private ArrayList<?> outValue;

  public String getName()
  {
    return this.name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public ArrayList<?> getOutValue() {
    return this.outValue;
  }
  public void setOutValue(ArrayList<?> outValue) {
    this.outValue = outValue;
  }
}