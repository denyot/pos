package cn.longhaul.sap.web;

import cn.longhaul.sap.service.SapRfcParamService;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionServlet;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class SapRfcParamAction extends BaseAction
{
  private SapRfcParamService sapRfcParamService = (SapRfcParamService)super.getService("sapRfcParamService");

  public ActionForward rfcTableInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("manageRfcParamView");
  }

  public ActionForward queryRfcItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    List rfcList = this.g4Reader.queryForPage("SapRfcParam.getRfcListForPage", inDto);
    for (int i = 0; i < rfcList.size(); i++) {
      Dto pDto = new BaseDto();
      pDto = (Dto)rfcList.get(i);
      String pass = G4Utils.decryptBasedDes(pDto.getAsString("pass"));
      pDto.put("pass", pass);
      rfcList.set(i, pDto);
    }
    Integer totalCount = (Integer)this.g4Reader.queryForObject("SapRfcParam.getRfcListForPageCount", inDto);
    String jsonStrList = JsonHelper.encodeList2PageJson(rfcList, totalCount, "yyyy-MM-dd");
    write(jsonStrList, response);
    return mapping.findForward(null);
  }

  public ActionForward saveRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    Dto outDto = this.sapRfcParamService.saveRfcItem(inDto);

    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    this.sapRfcParamService.deleteRfcItem(inDto);
    setOkTipMsg("RFC数据数据删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.sapRfcParamService.updateRfcItem(inDto);
    setOkTipMsg("RFC数据数据修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward synMemory(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    List rfcList = this.g4Reader.queryForList("SapRfcParam.getRfcViewList");
    getServlet().getServletContext().removeAttribute("RFCLIST");
    getServlet().getServletContext().setAttribute("RFCLIST", rfcList);
    setOkTipMsg("内存同步成功", response);
    return mapping.findForward(null);
  }
}