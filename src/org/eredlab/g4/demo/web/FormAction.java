package org.eredlab.g4.demo.web;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionServlet;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class FormAction extends BaseAction {
	public ActionForward basicInput4PropertyInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("basicInput4PropertyView");
	}

	public ActionForward basicInput4MethodInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("basicInput4MethodView");
	}

	public ActionForward dataTimeInputInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("dataTimeInputView");
	}

	public ActionForward selectInputBasedLocalDataSourceInit(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("selectInputBasedLocalDataSourceView");
	}

	public ActionForward selectInputBasedCodeTableDataSourceInit(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("selectInputBasedCodeTableDataSourceView");
	}

	public ActionForward selectInputBasedRemoteDataSourceInit(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("selectInputBasedRemoteDataSourceView");
	}

	public ActionForward selectInputBasedMultilevelInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("selectInputBasedMultilevelView");
	}

	public ActionForward queryAreaDatas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List areaList = this.g4Reader
				.queryForList("Demo.getChinaDataArea", dto);
		String jsonString = JsonHelper.encodeObject2Json(areaList);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryAreaDatas4Paging(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		List areaList = this.g4Reader.queryForPage(
				"Demo.getChinaDataArea4Paging", dto);
		Integer totalInteger = (Integer) this.g4Reader.queryForObject(
				"Demo.getChinaDataArea4PagingForPageCount", dto);
		String jsonString = encodeList2PageJson(areaList, totalInteger, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward radioCheckBoxInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("radioCheckBoxView");
	}

	public ActionForward formSubmitInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("formSubmitView");
	}

	public ActionForward formSynSubmitInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("formSynSubmitView");
	}

	public ActionForward formSynForwardInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		request.setAttribute("value", inDto.toJson());
		return mapping.findForward("formSynForwardPageView");
	}

	public ActionForward saveTheSubmitInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		System.out.println("接收到的表单提交参数：\n" + dto);
		setOkTipMsg("数据提交成功:" + dto.toString(), response);
		return mapping.findForward(null);
	}

	public ActionForward saveTheSubmitInfoBasedAjaxRequest(
			ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		System.out.println("接收到的表单提交参数：\n" + dto);
		setOkTipMsg("数据提交成功:" + dto.toString(), response);
		return mapping.findForward(null);
	}

	public ActionForward loadCallBack(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto outDto = new BaseDto();
		outDto.put("text1", "熊春");
		outDto.put("text2", "托尼贾");
		String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, null);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward toobarDemo1Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("toolbarDemo1View");
	}

	public ActionForward msgDemo1Init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("msgDemo1View");
	}

	public ActionForward formLayoutInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("formLayoutView");
	}

	public ActionForward columnLayoutInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("columnLayoutView");
	}

	public ActionForward complexLayoutInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("complexLayoutView");
	}

	public ActionForward complexLayout2Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("complexLayout2View");
	}

	public ActionForward htmlEditorInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("htmlEditorInitView");
	}

	public ActionForward htmlEditor2Init(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("htmlEditor2InitView");
	}

	public ActionForward doUpload(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Dto outDto = new BaseDto();
		CommonActionForm cForm = (CommonActionForm) form;

		FormFile myFile = cForm.getFile1();

		String savePath = getServlet().getServletContext().getRealPath("/")
				+ "uploaddata/demo/";

		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdir();
		}
		String type = myFile.getFileName().substring(
				myFile.getFileName().lastIndexOf("."));

		String fileName = getSessionContainer(request).getUserInfo()
				.getUserid();
		fileName = fileName + "_" + G4Utils.getCurrentTime("yyyyMMddhhmmss")
				+ type;

		File fileToCreate = new File(savePath, fileName);
		if (myFile.getFileSize() > 204800) {
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "文件上传失败,你只能上传小于100KB的图片文件");
			outDto.put("state", "error");
		} else {
			if (!fileToCreate.exists()) {
				FileOutputStream os = new FileOutputStream(fileToCreate);
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			}
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "文件上传成功");
			outDto.put("state", "ok");
			outDto.put("aUrl", request.getContextPath() + "/uploaddata/demo/"
					+ fileName);
		}
		write(outDto.toJson(), response);
		return mapping.findForward(null);
	}
}