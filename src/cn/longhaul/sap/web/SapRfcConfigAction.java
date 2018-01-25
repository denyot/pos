package cn.longhaul.sap.web;

import cn.longhaul.sap.service.SapSyncBaseService;
import cn.longhaul.sap.syncbase.RFCFieldInfo;
import cn.longhaul.sap.syncbase.RFCInfo;
import cn.longhaul.sap.syncbase.RfcTable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class SapRfcConfigAction extends BaseAction
{
  private SapSyncBaseService sapSyncBaseService = (SapSyncBaseService)super
    .getService("sapSyncBaseService");

  public ActionForward rfcsearch(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    String rfcId = inDto.getAsString("rfcId");
    rfcId = rfcId == null ? "" : rfcId.toUpperCase();
    RFCInfo rfcInfo = this.sapSyncBaseService.getRfcInfo(rfcId);
    if (rfcInfo == null) {
      setErrTipMsg("RFC函数" + rfcId + "查找失败，请检查RFC函数是否存在！", response);
      return mapping.findForward(null);
    }
    setOkTipMsg("已经查找到RFC函数" + rfcId, response);
    request.setAttribute("rfcinfo", rfcInfo);
    return mapping.findForward("mapRfc");
  }

  public ActionForward rfcreport(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    String rfcId = inDto.getAsString("rfcId");
    rfcId = rfcId == null ? "" : rfcId.toUpperCase();
    RFCInfo rfcInfo = this.sapSyncBaseService.getRfcInfo(rfcId);
    String rfcName = rfcInfo.getRfcName();
    List inputparainfo = rfcInfo.getInputFiledInfo();
    Dto map = new BaseDto();
    if ((inputparainfo != null) && (inputparainfo.size() > 0)) {
      for (int i = 0; i < inputparainfo.size(); i++) {
        RFCFieldInfo rfcfieldinfo = (RFCFieldInfo)inputparainfo.get(i);
        map.put(rfcfieldinfo.getFieldName(), 
          rfcfieldinfo.getFieldNameValue());
      }
    }
    RFCInfo result = this.sapSyncBaseService.searchMtableData("", rfcName, map);
    request.setAttribute("rfcInfo", rfcInfo);
    request.setAttribute("dataResult", result);
    return mapping.findForward("searchData");
  }

  public ActionForward searchData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    RFCInfo rfcInfo = (RFCInfo)inDto.get("rfcInfo");
    List inputParaInfo = rfcInfo.getInputFiledInfo();
    Dto map = new BaseDto();
    String rfcname = rfcInfo.getRfcName();
    if ((inputParaInfo != null) && (inputParaInfo.size() > 0)) {
      for (int i = 0; i < inputParaInfo.size(); i++) {
        RFCFieldInfo rfcFieldInfo = (RFCFieldInfo)inputParaInfo.get(i);
        String fieldNameValue = request.getParameter(
          rfcFieldInfo.getFieldName());
        rfcFieldInfo.setFieldNameValue(fieldNameValue);
        String mapfiledDescription = request.getParameter("aig" + 
          rfcFieldInfo.getFieldName() + "desc");
        rfcFieldInfo.setMapfiledDescription(mapfiledDescription);
        map.put(rfcFieldInfo.getFieldName(), fieldNameValue);
      }
    }
    List rfctable = rfcInfo.getRfcTableList();
    if (rfctable != null) {
      List rfctablelist = rfcInfo.getRfcTableList();
      for (int j = 0; j < rfctablelist.size(); j++) {
        RfcTable rfclistTable = (RfcTable)rfctablelist.get(j);
        List rfctableinfo = rfclistTable.getRfcTableinfo();
        for (int i = 0; i < rfctableinfo.size(); i++) {
          RFCFieldInfo rfcfieldinfo = 
            (RFCFieldInfo)rfctableinfo
            .get(i);
          String mapAIgfieldName = request.getParameter("aig" + 
            rfcfieldinfo.getFieldName());
          rfcfieldinfo.setMapAIgfieldName(mapAIgfieldName);
          String mapfiledDescription = request.getParameter("aig" + 
            rfcfieldinfo.getFieldName() + "desc");
          rfcfieldinfo.setMapfiledDescription(mapfiledDescription);
        }
      }
    }
    RFCInfo result = this.sapSyncBaseService.searchMtableData("", rfcname, map);
    request.setAttribute("rfcinfo", rfcInfo);
    request.setAttribute("dataresult", result);
    return mapping.findForward(null);
  }

  public ActionForward searchdataFilter(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    RFCInfo rfcInfo = (RFCInfo)request.getSession()
      .getAttribute("rfcInfo");
    ArrayList inputParaInfo = rfcInfo.getInputFiledInfo();
    Dto map = new BaseDto();
    String rfcName = rfcInfo.getRfcName();
    if ((inputParaInfo != null) && (inputParaInfo.size() > 0)) {
      for (int i = 0; i < inputParaInfo.size(); i++) {
        RFCFieldInfo rfcFieldInfo = (RFCFieldInfo)inputParaInfo.get(i);
        String fieldNameValue = request.getParameter(
          rfcFieldInfo.getFieldName());
        rfcFieldInfo.setFieldNameValue(fieldNameValue);
        map.put(rfcFieldInfo.getFieldName(), fieldNameValue);
      }
    }
    ArrayList rfctable = rfcInfo.getRfcTableList();
    if (rfctable != null) {
      ArrayList rfctablelist = rfcInfo.getRfcTableList();
      for (int j = 0; j < rfctablelist.size(); j++) {
        RfcTable rfclistTable = (RfcTable)rfctablelist.get(j);
        ArrayList rfctableinfo = rfclistTable.getRfcTableinfo();
        for (int i = 0; i < rfctableinfo.size(); i++) {
          RFCFieldInfo rfcfieldinfo = 
            (RFCFieldInfo)rfctableinfo
            .get(i);
          String fieldNameFilterValue = request.getParameter(
            rfcfieldinfo.getFieldName() + "filter");
          rfcfieldinfo.setFieldNameFilterValue(fieldNameFilterValue);
        }
      }
    }
    RFCInfo result = this.sapSyncBaseService.searchMtableData("", rfcName, map);

    ArrayList rfctablelist = result.getRfcTableList();
    for (int k = 0; k < rfctablelist.size(); k++) {
      ArrayList resultFilter = new ArrayList();
      RfcTable rfclistTable = (RfcTable)rfctablelist.get(k);
      ArrayList rfctabledata = rfclistTable.getTable();
      String datarfctablename = rfclistTable.getTablename();
      ArrayList rfctableinfo = null;
      ArrayList readrfctablelist = rfcInfo.getRfcTableList();
      for (int readj = 0; readj < readrfctablelist.size(); readj++) {
        RfcTable readrfclistTable = 
          (RfcTable)readrfctablelist
          .get(readj);
        String readrfctablename = readrfclistTable.getTablename();
        if (readrfctablename.equals(datarfctablename)) {
          rfctableinfo = readrfclistTable.getRfcTableinfo();
          break;
        }
      }
      for (int i = 0; i < rfctabledata.size(); i++) {
        boolean usserfilter = true;
        boolean usserfilterand = true;
        boolean alllnoFilter = true;
        String userchoseoption = request
          .getParameter("userchoseoption") == null ? "" : request
          .getParameter("userchoseoption").toString();
        HashMap hd = (HashMap)rfctabledata.get(i);
        for (int j = 0; j < rfctableinfo.size(); j++) {
          RFCFieldInfo rfcfieldinfo = 
            (RFCFieldInfo)rfctableinfo
            .get(j);
          String fieldNameFilterValue = rfcfieldinfo
            .getFieldNameFilterValue().trim();
          String value = hd.get(rfcfieldinfo.getFieldName())
            .toString();
          if (!fieldNameFilterValue.equals("")) {
            if (value.indexOf(fieldNameFilterValue) > -1) {
              usserfilter = false;
              usserfilterand = usserfilterand;
            } else {
              usserfilter = usserfilter;
              usserfilterand = false;
            }
            alllnoFilter = false;
          }
        }
        if (userchoseoption.equals("on")) {
          if (usserfilterand) {
            resultFilter.add(hd);
          }
          request.setAttribute("userchoseoption", "on");
        }
        else if ((!usserfilter) || (alllnoFilter))
        {
          resultFilter.add(hd);
        }

      }

      rfclistTable.setTable(resultFilter);
    }

    request.setAttribute("rfcinfo", rfcInfo);
    request.setAttribute("dataresult", result);

    return mapping.findForward(null);
  }

  public ActionForward searchdataExport(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward(null);
  }

  public ActionForward searchdatado(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    RFCInfo rfcInfo = (RFCInfo)request.getSession()
      .getAttribute("rfcInfo");
    List inputparainfo = rfcInfo.getInputFiledInfo();
    Dto map = new BaseDto();
    String rfcname = rfcInfo.getRfcName();
    if ((inputparainfo != null) && (inputparainfo.size() > 0)) {
      for (int i = 0; i < inputparainfo.size(); i++) {
        RFCFieldInfo rfcfieldinfo = (RFCFieldInfo)inputparainfo.get(i);
        String fieldNameValue = request.getParameter(
          rfcfieldinfo.getFieldName());
        rfcfieldinfo.setFieldNameValue(fieldNameValue);
        map.put(rfcfieldinfo.getFieldName(), fieldNameValue);
      }
    }

    List rfctable = rfcInfo.getRfcTableList();
    if (rfctable != null) {
      List rfctablelist = rfcInfo.getRfcTableList();
      for (int j = 0; j < rfctablelist.size(); j++) {
        RfcTable rfclistTable = (RfcTable)rfctablelist.get(j);
        List rfctableinfo = rfclistTable.getRfcTableinfo();
        for (int i = 0; i < rfctableinfo.size(); i++) {
          RFCFieldInfo rfcfieldinfo = 
            (RFCFieldInfo)rfctableinfo
            .get(i);
          String fieldNameFilterValue = "";
          rfcfieldinfo.setFieldNameFilterValue(fieldNameFilterValue);
        }
      }
    }
    RFCInfo result = this.sapSyncBaseService.searchMtableData("", rfcname, map);
    request.setAttribute("rfcinfo", rfcInfo);
    request.setAttribute("dataresult", result);

    return mapping.findForward(null);
  }

  public ActionForward addRFCSet(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String aigtablename = "";
    RFCInfo rfcInfo = (RFCInfo)request.getSession().getAttribute("rfcInfo");
    List inputparainfo = rfcInfo.getInputFiledInfo();
    String rfcName = rfcInfo.getRfcName();
    if ((inputparainfo != null) && (inputparainfo.size() > 0)) {
      for (int i = 0; i < inputparainfo.size(); i++) {
        RFCFieldInfo rfcfieldinfo = (RFCFieldInfo)inputparainfo.get(i);
        String mapAIgfieldName = request.getParameter("aigvalue" + 
          rfcfieldinfo.getFieldName());
        rfcfieldinfo.setMapAIgfieldName(mapAIgfieldName);
        String mapfiledDescription = request.getParameter("aig" + 
          rfcfieldinfo.getFieldName() + "desc");
        rfcfieldinfo.setMapfiledDescription(mapfiledDescription);
        String fieldper = request.getParameter(
          rfcfieldinfo.getFieldName() + "per");

        rfcfieldinfo.setFieldper(fieldper);
        RfcTable sonTable = rfcfieldinfo.getSonTable();
        if (sonTable != null) {
          List<RFCFieldInfo> sonFieldInfo = (List<RFCFieldInfo>) sonTable.getRfcTableinfo();
          if (sonFieldInfo != null) {
            for (RFCFieldInfo fieldInfo : sonFieldInfo) {
              mapAIgfieldName = request
                .getParameter("aigvalue" + 
                fieldInfo.getFieldName() + 
                rfcfieldinfo.getFieldName());
              fieldInfo.setMapAIgfieldName(mapAIgfieldName);
              mapfiledDescription = request
                .getParameter("aig" + 
                fieldInfo.getFieldName() + 
                rfcfieldinfo.getFieldName() + 
                "desc");
              fieldInfo
                .setMapfiledDescription(mapfiledDescription);
              fieldper = request.getParameter(fieldInfo
                .getFieldName() + 
                rfcfieldinfo.getFieldName() + "per");
              fieldInfo.setFieldper(fieldper);
            }
          }
        }
      }
    }
    List rfctable = rfcInfo.getRfcTableList();
    if (rfctable != null) {
      List rfctablelist = rfcInfo.getRfcTableList();
      for (int j = 0; j < rfctablelist.size(); j++) {
        RfcTable rfclistTable = (RfcTable)rfctablelist.get(j);
        List rfctableinfo = rfclistTable.getRfcTableinfo();
        aigtablename = request.getParameter("aig" + 
          rfclistTable.getTablename());
        rfclistTable.setAigtablename(aigtablename);
        for (int i = 0; i < rfctableinfo.size(); i++) {
          RFCFieldInfo rfcfieldinfo = 
            (RFCFieldInfo)rfctableinfo
            .get(i);
          String mapAIgfieldName = request.getParameter("aig" + 
            rfcfieldinfo.getFieldName());
          rfcfieldinfo.setMapAIgfieldName(mapAIgfieldName);
          String mapfiledDescription = request.getParameter("aig" + 
            rfcfieldinfo.getFieldName() + "desc");

          rfcfieldinfo
            .setMapfiledDescription(mapfiledDescription);
          String mapfiledpri = request.getParameter("aig" + 
            rfcfieldinfo.getFieldName() + "pri");
          mapfiledpri = (mapfiledpri != null) && 
            (mapfiledpri.equals("on")) ? "PRI" : "";
          rfcfieldinfo.setPri(mapfiledpri);
        }
      }
    }
    request.setAttribute("rfcInfo", rfcInfo);
    request.setAttribute("url", "rfcbasesyn");
    request.setAttribute("tableName", aigtablename);
    request.setAttribute("rfcName", rfcName);
    return mapping.findForward("rfcUserJobDefault");
  }
}