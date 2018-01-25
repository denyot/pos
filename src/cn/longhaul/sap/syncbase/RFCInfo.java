package cn.longhaul.sap.syncbase;

import java.util.ArrayList;

public class RFCInfo
{
  private String rfcInfo;
  private String rfcName;
  private ArrayList<?> inputFiledInfo;
  private ArrayList<?> outputFiledInfo;
  private ArrayList<?> rfcTableList;

  public ArrayList<?> getRfcTableList()
  {
    return this.rfcTableList;
  }
  public void setRfcTableList(ArrayList<?> rfcTableList) {
    this.rfcTableList = rfcTableList;
  }
  public String getRfcInfo() {
    return this.rfcInfo;
  }
  public ArrayList<?> getInputFiledInfo() {
    return this.inputFiledInfo;
  }
  public void setInputFiledInfo(ArrayList<?> inputFiledInfo) {
    this.inputFiledInfo = inputFiledInfo;
  }
  public void setRfcInfo(String rfcInfo) {
    this.rfcInfo = rfcInfo;
  }

  public String getRfcName()
  {
    return this.rfcName;
  }
  public void setRfcName(String rfcNmae) {
    this.rfcName = rfcNmae;
  }
  public ArrayList<?> getOutputFiledInfo() {
    return this.outputFiledInfo;
  }
  public void setOutputfiledinfo(ArrayList<?> outputFiledInfo) {
    this.outputFiledInfo = outputFiledInfo;
  }
}