package cn.longhaul.sap.syncbase;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class InputParaTable
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String inputParaName;
  private Map<String, String> inputParaValue;

  public String getInputParaName()
  {
    return this.inputParaName;
  }

  public void setInputParaName(String inputParaName)
  {
    this.inputParaName = inputParaName;
  }

  public Map<String, String> getInputParaValue()
  {
    if (this.inputParaValue == null) {
      this.inputParaValue = new HashMap();
    }
    return this.inputParaValue;
  }
}