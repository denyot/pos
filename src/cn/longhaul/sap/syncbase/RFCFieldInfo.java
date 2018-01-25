package cn.longhaul.sap.syncbase;

import java.util.ArrayList;

public class RFCFieldInfo
{
  private String fieldName;
  private String fieldType;
  private String filedDescription;
  private int length;
  private String mapAIgfieldName;
  private String fieldNameValue;
  private String fieldNameFilterValue = "";
  private String mapfieldType;
  private String fieldper;
  private String mapfiledDescription;
  private String pri;
  private RfcTable sonTable;
  private String outputParaValue;

  public String getFieldName()
  {
    return this.fieldName;
  }

  public int getLength() {
    return this.length;
  }

  public void setLength(int length) {
    this.length = length;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }

  public String getFieldType() {
    return this.fieldType;
  }

  public void setFieldType(String fieldType) {
    this.fieldType = fieldType;
  }

  public String getFiledDescription() {
    return this.filedDescription;
  }

  public void setFiledDescription(String filedDescription) {
    this.filedDescription = filedDescription;
  }

  public String getMapAIgfieldName() {
    return this.mapAIgfieldName;
  }

  public void setMapAIgfieldName(String mapAIgfieldName) {
    this.mapAIgfieldName = mapAIgfieldName;
  }

  public String getMapfieldType() {
    return this.mapfieldType;
  }

  public void setMapfieldType(String mapfieldType) {
    this.mapfieldType = mapfieldType;
  }

  public String getMapfiledDescription() {
    return this.mapfiledDescription;
  }

  public void setMapfiledDescription(String mapfiledDescription) {
    this.mapfiledDescription = mapfiledDescription;
  }

  public String getPri() {
    return this.pri;
  }

  public void setPri(String pri) {
    this.pri = pri;
  }

  public String getFieldNameValue() {
    return this.fieldNameValue;
  }

  public void setFieldNameValue(String fieldNameValue) {
    this.fieldNameValue = fieldNameValue;
  }

  public String getFieldNameFilterValue() {
    return this.fieldNameFilterValue;
  }

  public void setFieldNameFilterValue(String fieldNameFilterValue) {
    this.fieldNameFilterValue = fieldNameFilterValue;
  }

  public String getFieldper() {
    return this.fieldper;
  }

  public void setFieldper(String fieldper) {
    this.fieldper = fieldper;
  }

  public RfcTable getSonTable()
  {
    return this.sonTable;
  }

  public void setSonTable(RfcTable sonTable)
  {
    this.sonTable = sonTable;
  }

  public String getOutputParaValue()
  {
    return this.outputParaValue;
  }

  public void setOutputParaValue(String outputParaValue)
  {
    this.outputParaValue = outputParaValue;
  }

  public String getSonTableInfo() {
    StringBuffer sb = new StringBuffer();
    RfcTable sonTable = getSonTable();
    if (sonTable != null) {
      ArrayList<RFCFieldInfo> sonInfo = (ArrayList<RFCFieldInfo>) sonTable.getRfcTableinfo();
      for (RFCFieldInfo info : sonInfo) {
        sb.append("<tr>")
          .append("<td align='right' class = 'bodytd1'>").append(
          info.getFiledDescription()).append("(").append(
          sonTable.getTablename()).append(")").append(
          "</td>");
        sb.append("<td class='bodytd2'>").append(info.getFieldName())
          .append("</td>");
        sb
          .append(
          "<td class='bodytd2'>描述：<input class='textdocdown' name='aig")
          .append(info.getFieldName() + this.fieldName).append("desc' value='")
          .append(info.getFiledDescription()).append(
          "' style='width:100px'/>");
        sb.append(" 值：<input class='textdocdown' name='aigvalue")
          .append(info.getFieldName() + this.fieldName).append(
          "' style='width:100px' />");
        sb.append("<input type='hidden' name='hiddenName'/>");
        sb
          .append(
          "<a id='defaultSuj' name='singleSelect' href=\"javascript:callAddressSAP('name:ad', 'hiddenName:aigvalue")
          .append(info.getFieldName()).append(
          "', false,'SAP_D_DefalultFunction','aigvalue")
          .append(info.getFieldName()).append("','").append(
          info.getFieldName()).append("per');\">");
        sb.append("   ")
          .append("<img border='0' src='../images/icon/icon_select.gif' width='13' height='14'></a>");
        sb.append("  表达示：").append("<input class='textdocdown' name='")
          .append(info.getFieldName() + this.fieldName).append(
          "per' style='width:100px'/>");
        sb.append("</td>");
        sb.append("<td align='right' class='bodytd1'>").append(
          info.getFieldType()).append("</td>");
        sb.append("</tr>");
        if (info.getSonTable() != null) {
          getSonTableInfo();
        }
      }
    }
    return sb.toString();
  }
}