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

public class BeanMonitorAction extends BaseAction
{
  private MonitorService monitorService = (MonitorService)getService("monitorService");

  public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("beanMonitorView");
  }

  public ActionForward queryMonitorDatas(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List eventList = null;
    Integer totalCount = null;
    if (G4Utils.defaultJdbcTypeOracle()) {
      eventList = this.g4Reader.queryForPage("Monitor.queryBeanMonitorRecordsByDto", dto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryBeanMonitorRecordsByDtoForPageCount", dto);
    } else if (G4Utils.defaultJdbcTypeMysql()) {
      eventList = this.g4Reader.queryForPage("Monitor.queryBeanMonitorRecordsByDtoMysql", dto);
      totalCount = (Integer)this.g4Reader.queryForObject("Monitor.queryBeanMonitorRecordsByDtoForPageCountMysql", dto);
    }
    String jsonString = encodeList2PageJson(eventList, totalCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteMonitorDatas(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.monitorService.deleteMonitorData(dto);
    if (dto.getAsString("type").equalsIgnoreCase("reset"))
      setOkTipMsg("重置成功,所有监控记录已被清除!", response);
    else
      setOkTipMsg("数据删除成功!", response);
    return mapping.findForward(null);
  }
}