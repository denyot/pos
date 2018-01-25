package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class JdbcMonitorAction extends BaseAction
{
  private MonitorService monitorService = (MonitorService)super.getService("monitorService");

  public ActionForward jdbcInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("jdbcInitView");
  }

  public ActionForward queryMonitorData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    List eventList = null;
    Integer totalCount = null;
    if (G4Utils.defaultJdbcTypeOracle()) {
      eventList = this.g4Reader.queryForPage("Monitor.queryJdbcMonitorRecordsByDto", inDto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryJdbcMonitorRecordsByDtoForPageCount", inDto);
    } else if (G4Utils.defaultJdbcTypeMysql()) {
      eventList = this.g4Reader.queryForPage("Monitor.queryJdbcMonitorRecordsByDtoMysql", inDto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryJdbcMonitorRecordsByDtoForPageCountMysql", inDto);
    }
    String jsonString = encodeList2PageJson(eventList, totalCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward resetMonitorData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm cForm = (CommonActionForm)form;
    this.monitorService.resetMonitorData();
    setOkTipMsg("JDBC监控记录重置成功", response);
    return mapping.findForward(null);
  }
}