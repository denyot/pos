package cn.longhaul.pos.aftersales.web;

import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class RepairSystemAction extends BaseAction
{
  public ActionForward initAfterSSInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws IOException
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List infoList = this.g4Dao.queryForList(
      "basicinfo.getAftersalesserviceInfo", dto);
    String jsonString = JsonHelper.encodeObject2Json(infoList);
    write("{aftersslist:" + jsonString + "}", response);

    return mapping.findForward(null);
  }

  public ActionForward initReplacementInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws IOException
  {
    List infoList = this.g4Dao.queryForList("basicinfo.getReplacementInfo");
    String jsonString = JsonHelper.encodeObject2Json(infoList);
    write("{replacementlist:" + jsonString + "}", response);
    return mapping.findForward(null);
  }

  public ActionForward saveFirstInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_numbers", werks);
    } else {
      return mapping.findForward("authorization");
    }
    try {
      this.g4Dao.insert("facelift.saveOneInfo", dto);
      write("{success:true,msg:'成功'}", response);
    } catch (Exception e) {
      e.printStackTrace();
      write("{success:false,msg:'失败'}", response);
      throw e;
    }
    return mapping.findForward(null);
  }

  public ActionForward saveSecondInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    int i = this.g4Dao.update("facelift.updateSecondInfo", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward saveThirdInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    int i = this.g4Dao.update("facelift.updateThirdInfo", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else {
      write("{success:false,msg:'失败'}", response);
    }
    return mapping.findForward(null);
  }

  public ActionForward getRepairInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_numbers", werks);
    } else {
      return mapping.findForward("authorization");
    }
    List list = this.g4Reader.queryForPage("facelift.getRepairInfo", 
      dto);
    Integer totalCount = (Integer)this.g4Reader.queryForObject(
      "facelift.getTotalRepairCount", dto);
    String jsonString = encodeList2PageJson(list, totalCount, "yyyy-MM-dd");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward updateFirstInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String deptId = "";
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_numbers", werks);
    } else {
      return mapping.findForward("authorization");
    }
    try {
      this.g4Dao.insert("facelift.updateFirstInfo", dto);
      write("{success:true,msg:'成功'}", response);
    } catch (Exception e) {
      e.printStackTrace();
      write("{success:false,msg:'失败'}", response);
      throw e;
    }
    return mapping.findForward(null);
  }

  public ActionForward delRepairInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo()
        .getCustomId();
      dto.put("store_number", werks);
    } else {
      return mapping.findForward("authorization");
    }
    String ids = request.getParameter("ids");
    String[] idArray = ids.split(",");
    dto.put("idArray", idArray);
    for (int i = 0; i < idArray.length; i++) {
      idArray[i] = idArray[i].trim();
    }
    int i = this.g4Dao.delete("facelift.delRepairInfo", dto);
    if (i != 0)
      write("{success:true,msg:'成功'}", response);
    else
      write("{success:false,msg:'失败'}", response);
    return mapping.findForward(null);
  }
}