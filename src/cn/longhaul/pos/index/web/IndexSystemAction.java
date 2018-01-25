package cn.longhaul.pos.index.web;

import java.io.File;
import java.io.FileOutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.esb.hesssion.SapTransfer;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import cn.longhaul.sap.system.info.TransferInfo;

public class IndexSystemAction extends BaseAction {
	
	/**保存公告信息*/
	@SuppressWarnings("unchecked")
	public ActionForward saveNotice(ActionMapping mapping, ActionForm form, HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto retDto = new BaseDto();
		try {
			int i = this.g4Dao.update("indexsystem.saveNotice", dto);
			if (i > 0) {
				retDto.put("message", "更新成功！");
				String jsonStr = JsonHelper.encodeObject2Json(retDto);
				write(jsonStr, response);
				return mapping.findForward(null);
			}
		} catch (Exception e) {
			retDto.put("message", e.getMessage());
			e.printStackTrace();
		}
		retDto.put("message", "更新失败！");
		String jsonStr = JsonHelper.encodeObject2Json(retDto);
		write(jsonStr, response);
		return mapping.findForward(null);
	}
	
	/**获取公告信息*/
	@SuppressWarnings("unchecked")
	public ActionForward getNotice(ActionMapping mapping, ActionForm form, HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Dto retDto = new BaseDto();
		String notice = (String) g4Reader.queryForObject("indexsystem.getNotice");
		retDto.put("notice", notice);
		String jsonStr = JsonHelper.encodeObject2Json(retDto);
		write(jsonStr, response);
		return mapping.findForward(null);
	}
	
	/**获取订单状态*/
	@SuppressWarnings("unchecked")
	public ActionForward getProcessed(ActionMapping mapping, ActionForm form, HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
		Dto dto = new BaseDto();
		Dto retDto = new BaseDto();
		dto.put("werks", werks);
		int transInCount = (Integer) g4Reader.queryForObject("indexsystem.getTransInCount", dto);
		retDto.put("transInCount", transInCount);
		int transOutCount = (Integer) g4Reader.queryForObject("indexsystem.getTransOutCount", dto);
		retDto.put("transOutCount", transOutCount);
		String vkorg = (String) this.g4Reader.queryForObject("stocksystem.getVkorg", dto);
		SapTransfer transferservice = new SapTransferImpl();
		TransferInfo transferInfo = new TransferInfo();
		transferInfo.getImportPara().getParameters().put("I_WERKS", werks);
		String rfc = "";
		if ("1000".equals(vkorg.trim()))
			rfc = "Z_RFC_STORE_11";
		else if ("9000".equals(vkorg.trim())) {
			rfc = "Z_RFC_STORE_13";
		}
		AigTransferInfo outinfo = transferservice.transferInfoAig(rfc, transferInfo);
		ArrayList l_AigTable = outinfo.getAigTable("IT_EKPO_HP");
		ArrayList l_AigTable2 = outinfo.getAigTable("IT_EKPO_DXF");
		if (G4Utils.isNotEmpty(l_AigTable2)){
			l_AigTable.addAll(l_AigTable2);
		}
		int receiveInCount = l_AigTable.size();
		retDto.put("receiveInCount", receiveInCount);
		
		//获取未收货标签
		 rfc = "Z_RFC_STORE_55";
		 outinfo = transferservice.transferInfoAig(rfc,
				transferInfo);
		 l_AigTable = outinfo.getAigTable("IT_ITAB");
		 retDto.put("lableCount", l_AigTable.size());
		String jsonStr = JsonHelper.encodeObject2Json(retDto);
		write(jsonStr, response);
		return mapping.findForward(null);
	}
	
	
	/** 插入图片 */
	@SuppressWarnings("unchecked")
	public ActionForward doUploadImage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		CommonActionForm cForm = (CommonActionForm) form;
		// 单个文件,如果是多个就cForm.getFile2()....支持最多5个文件
		FormFile myFile = cForm.getFile1();
		// 获取web应用根路径,也可以直接指定服务器任意盘符路径
		String savePath = getServlet().getServletContext().getRealPath("/") + "uploaddata/index/";
		//String savePath = "d:/upload/";
		// 检查路径是否存在,如果不存在则创建之
		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdir();
		}
		String type = myFile.getFileName().substring(myFile.getFileName().lastIndexOf("."));
		// 文件真实文件名
		String fileName = getSessionContainer(request).getUserInfo().getUserid();
		fileName = fileName + "_" + G4Utils.getCurrentTime("yyyyMMddhhmmss") + type;
		// 我们一般会根据某种命名规则对其进行重命名
		// String fileName = ;
		File fileToCreate = new File(savePath, fileName);
		if (myFile.getFileSize() > 204800) {
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "文件上传失败,你只能上传小于100KB的图片文件");
			outDto.put("state", "error");
		}else {
			// 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
			if (!fileToCreate.exists()) {
				FileOutputStream os = new FileOutputStream(fileToCreate);
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			}
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "文件上传成功");
			outDto.put("state", "ok");
			outDto.put("aUrl", request.getContextPath() + "/uploaddata/index/" + fileName);
		}
		write(outDto.toJson(), response);
		return mapping.findForward(null);
	}
	
}