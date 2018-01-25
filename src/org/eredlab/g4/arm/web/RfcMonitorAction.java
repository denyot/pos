package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.RFCMonitorService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class RfcMonitorAction extends BaseAction
{
  private RFCMonitorService monitorService = (RFCMonitorService)super.getService("rfcMonitorService");

  public ActionForward rfcInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("rfcInitView");
  }

  public ActionForward queryMonitorData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    List eventList = null;
    Integer totalCount = null;
    if (inDto.getAsString("funcname") != null)
      inDto.put("funcname", "%" + inDto.getAsString("funcname") + "%");
    if (G4Utils.defaultJdbcTypeOracle()) {
      eventList = this.g4Reader.queryForPage("RFCMonitor.getRfcInvokedInfo", inDto);
      totalCount = (Integer)this.g4Reader.queryForObject("RFCMonitor.getRfcInvokedInfoForPageCount", inDto);
    } else if (G4Utils.defaultJdbcTypeMysql()) {
      eventList = this.g4Reader.queryForPage("RFCMonitor.getRfcInvokedInfo", inDto);
      totalCount = (Integer)this.g4Reader.queryForObject("RFCMonitor.getRfcInvokedInfoForPageCount", inDto);
    }
    String jsonString = encodeList2PageJson(eventList, totalCount, "yyyy-MM-dd HH:mm:ss");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public void clearAll(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    this.monitorService.clearAll();
  }
}