package cn.longhaul.sap.syncbase;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class LinkBean
  implements Serializable
{
  private static final long serialVersionUID = 1L;
  private String rfcName;
  private Dto inputPara;
  private Map<String, RfcTable> rfcTable;
  private List<RFCFieldInfo> outputPara;
  private List<String> exceptionMess;

  public String getRfcName()
  {
    return this.rfcName;
  }

  public void setRfcName(String rfcName)
  {
    this.rfcName = rfcName;
  }

  public Dto getInputPara()
  {
    if (this.inputPara == null) {
      this.inputPara = new BaseDto();
    }
    return this.inputPara;
  }

  public Map<String, RfcTable> getRfcTable()
  {
    if (this.rfcTable == null) {
      this.rfcTable = new HashMap();
    }
    return this.rfcTable;
  }

  public List<RFCFieldInfo> getOutputPara()
  {
    if (this.outputPara == null)
    {
      this.outputPara = new ArrayList();
    }
    return this.outputPara;
  }

  public List<String> getExceptionMess()
  {
    if (this.exceptionMess == null) {
      this.exceptionMess = new ArrayList();
    }
    return this.exceptionMess;
  }
}