package cn.longhaul.sap.system.info;

import java.util.ArrayList;
import java.util.HashMap;

public class TransferAigInfo
{
  private String rfcname;
  private String rfc_id;
  private ArrayList<HashMap<String, String>> rfcImportParameterList;
  private ArrayList<HashMap<String, String>> rfcExportParameterList;
  private ArrayList<HashMap<String, String>> rfcChangingParameterList;
  private ArrayList<HashMap<String, String>> rfcTalbeParaMeterList;
  private ArrayList<HashMap<String, String>> rfCExceptionList;

  public String getRfcname()
  {
    return this.rfcname;
  }
  public String getRfc_id() {
    return this.rfc_id;
  }
  public void setRfc_id(String rfc_id) {
    this.rfc_id = rfc_id;
  }

  public void setRfcname(String rfcname) {
    this.rfcname = rfcname;
  }
  public ArrayList<HashMap<String, String>> getRfcImportParameterList() {
    return this.rfcImportParameterList;
  }
  public void setRfcImportParameterList(ArrayList<HashMap<String, String>> rfcImportParameterList) {
    this.rfcImportParameterList = rfcImportParameterList;
  }
  public ArrayList<HashMap<String, String>> getRfcExportParameterList() {
    return this.rfcExportParameterList;
  }
  public void setRfcExportParameterList(ArrayList<HashMap<String, String>> rfcExportParameterList) {
    this.rfcExportParameterList = rfcExportParameterList;
  }
  public ArrayList<HashMap<String, String>> getRfcChangingParameterList() {
    return this.rfcChangingParameterList;
  }
  public void setRfcChangingParameterList(ArrayList<HashMap<String, String>> rfcChangingParameterList) {
    this.rfcChangingParameterList = rfcChangingParameterList;
  }
  public ArrayList<HashMap<String, String>> getRfcTalbeParaMeterList() {
    return this.rfcTalbeParaMeterList;
  }
  public void setRfcTalbeParaMeterList(ArrayList<HashMap<String, String>> rfcTalbeParaMeterList) {
    this.rfcTalbeParaMeterList = rfcTalbeParaMeterList;
  }
  public ArrayList<HashMap<String, String>> getRfCExceptionList() {
    return this.rfCExceptionList;
  }
  public void setRfCExceptionList(ArrayList<HashMap<String, String>> rfCExceptionList) {
    this.rfCExceptionList = rfCExceptionList;
  }
}