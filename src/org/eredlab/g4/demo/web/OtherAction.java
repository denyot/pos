package org.eredlab.g4.demo.web;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionServlet;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.ftp.FtpHelper;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.demo.service.DemoService;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class OtherAction extends BaseAction {
	private DemoService demoService = (DemoService) getService("demoService");

	public ActionForward uploadInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("fileUploadView");
	}

	public ActionForward queryFileDatas(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String sqlid = G4Utils.defaultJdbcTypeOracle() ? "Demo.queryFiles4Oracle"
				: "Demo.queryFiles";
		List list = this.g4Reader.queryForPage(sqlid, dto);
		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"Demo.countFiles", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd HH:mm:ss");
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward doUpload(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;

		FormFile myFile = cForm.getFile1();

		String savePath = getServlet().getServletContext().getRealPath("/")
				+ "uploaddata/";

		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdir();
		}

		savePath = savePath + G4Utils.getCurDate() + "/";
		File file1 = new File(savePath);
		if (!file1.exists()) {
			file1.mkdir();
		}

		String fileName = myFile.getFileName();

		File fileToCreate = new File(savePath, fileName);

		if (!fileToCreate.exists()) {
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		} else {
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		}

		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("title",
				G4Utils.isEmpty(inDto.getAsString("title")) ? fileName : inDto
						.getAsString("title"));
		inDto.put("filesize", Integer.valueOf(myFile.getFileSize()));
		inDto.put("path", savePath + fileName);
		this.demoService.doUpload(inDto);
		setOkTipMsg("文件上传成功", response);
		return mapping.findForward(null);
	}

	public ActionForward delFiles(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String[] strChecked = dto.getAsString("strChecked").split(",");
		for (int i = 0; i < strChecked.length; i++) {
			String fileid = strChecked[i];
			Dto fileDto = (BaseDto) this.g4Reader.queryForObject(
					"Demo.queryFileByFileID", fileid);
			String path = fileDto.getAsString("path");
			File file = new File(path);
			file.delete();
			this.demoService.delFile(fileid);
		}
		setOkTipMsg("文件删除成功", response);
		return mapping.findForward(null);
	}

	public ActionForward downloadFile(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String fileid = dto.getAsString("fileid");
		Dto fileDto = (BaseDto) this.g4Reader.queryForObject(
				"Demo.queryFileByFileID", fileid);

		String filename = G4Utils.encodeChineseDownloadFileName(request,
				fileDto.getAsString("title"));
		response.setHeader("Content-Disposition", "attachment; filename="
				+ filename + ";");
		String path = fileDto.getAsString("path");
		File file = new File(path);
		BufferedInputStream in = new BufferedInputStream(new FileInputStream(
				file));
		ByteArrayOutputStream out = new ByteArrayOutputStream(1024);
		byte[] temp = new byte[1024];
		int size = 0;
		while ((size = in.read(temp)) != -1) {
			out.write(temp, 0, size);
		}
		in.close();
		ServletOutputStream os = response.getOutputStream();
		os.write(out.toByteArray());
		os.flush();
		os.close();
		return mapping.findForward(null);
	}

	public ActionForward doUploadBasedFlah(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		FormFile myFile = cForm.getSwfUploadFile();

		String savePath = getServlet().getServletContext().getRealPath("/")
				+ "uploaddata/";

		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdir();
		}

		savePath = savePath + G4Utils.getCurDate() + "/";
		File file1 = new File(savePath);
		if (!file1.exists()) {
			file1.mkdir();
		}

		String fileName = myFile.getFileName();

		File fileToCreate = new File(savePath, fileName);

		if (!fileToCreate.exists()) {
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		} else {
			FileOutputStream os = new FileOutputStream(fileToCreate);
			os.write(myFile.getFileData());
			os.flush();
			os.close();
		}

		Dto inDto = cForm.getParamAsDto(request);
		inDto.put("title",
				G4Utils.isEmpty(inDto.getAsString("title")) ? fileName : inDto
						.getAsString("title"));
		inDto.put("filesize", Integer.valueOf(myFile.getFileSize()));
		inDto.put("path", savePath + fileName);
		this.demoService.doUpload(inDto);
		setOkTipMsg("文件上传成功", response);
		return mapping.findForward(null);
	}

	public ActionForward doUploadByFTP(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm cForm = (CommonActionForm) form;
		boolean b = true;

		FormFile myFile = cForm.getFile1();

		FtpHelper ftpHelper = new FtpHelper();
		ftpHelper.createConnection("127.0.0.1", "anonymous", "", 21);
		ftpHelper.useWorkingDir("/files/中文路劲支持");
		b = ftpHelper.storeFile(myFile.getInputStream(), "中文名支持"
				+ myFile.getFileName());

		ftpHelper.disconnect();

		String msg = "";
		if (b)
			msg = "文件上传成功,此操作需要FTP服务器配合,请查看后台代码";
		else {
			msg = "文件上传失败";
		}
		setOkTipMsg(msg, response);
		return mapping.findForward(null);
	}
}