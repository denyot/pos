package org.eredlab.g4.rif.web;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.WebUtils;

public class CommonActionForm extends BaseActionForm {
	private FormFile theFile;
	private FormFile file1;
	private FormFile file2;
	private FormFile file3;
	private FormFile file4;
	private FormFile file5;
	private FormFile swfUploadFile;

	public void CommonActionForm() {
	}

	public Dto getParamAsDto(HttpServletRequest request) {
		return WebUtils.getPraramsAsDto(request);
	}

	public String getTreeNodeUID4Clicked(HttpServletRequest request) {
		return request.getParameter("node");
	}

	public List getGridDirtyData(HttpServletRequest request) {
		List list = new ArrayList();
		String dirtyData = request.getParameter("dirtydata");
		if (G4Utils.isEmpty(dirtyData)) {
			return list;
		}
		dirtyData = dirtyData.substring(1, dirtyData.length() - 1);
		String[] dirtyDatas = dirtyData.split("},");
		for (int i = 0; i < dirtyDatas.length; i++) {
			if (i != dirtyDatas.length - 1) {
				int tmp66_64 = i;
				String[] tmp66_62 = dirtyDatas;
				tmp66_62[tmp66_64] = (tmp66_62[tmp66_64] + "}");
			}
			Dto dto = JsonHelper.parseSingleJson2Dto(dirtyDatas[i]);
			list.add(dto);
		}
		return list;
	}

	public List getGridDirtyData(HttpServletRequest request, String record) {
		List list = new ArrayList();
		String dirtyData = request.getParameter(record);
		if (G4Utils.isEmpty(dirtyData)) {
			return list;
		}
		dirtyData = dirtyData.substring(1, dirtyData.length() - 1);
		String[] dirtyDatas = dirtyData.split("},");
		for (int i = 0; i < dirtyDatas.length; i++) {
			if (i != dirtyDatas.length - 1) {
				int tmp71_69 = i;
				String[] tmp71_67 = dirtyDatas;
				tmp71_67[tmp71_69] = (tmp71_67[tmp71_69] + "}");
			}
			Dto dto = JsonHelper.parseSingleJson2Dto(dirtyDatas[i]);
			list.add(dto);
		}
		return list;
	}

	public void reset(ActionMapping mapping, HttpServletRequest request) {
		super.reset(mapping, request);
	}

	public FormFile getTheFile() {
		return this.theFile;
	}

	public void setTheFile(FormFile theFile) {
		this.theFile = theFile;
	}

	public FormFile getFile1() {
		return this.file1;
	}

	public void setFile1(FormFile file1) {
		this.file1 = file1;
	}

	public FormFile getFile2() {
		return this.file2;
	}

	public void setFile2(FormFile file2) {
		this.file2 = file2;
	}

	public FormFile getFile3() {
		return this.file3;
	}

	public void setFile3(FormFile file3) {
		this.file3 = file3;
	}

	public FormFile getFile4() {
		return this.file4;
	}

	public void setFile4(FormFile file4) {
		this.file4 = file4;
	}

	public FormFile getFile5() {
		return this.file5;
	}

	public void setFile5(FormFile file5) {
		this.file5 = file5;
	}

	public FormFile getSwfUploadFile() {
		return this.swfUploadFile;
	}

	public void setSwfUploadFile(FormFile swfUploadFile) {
		this.swfUploadFile = swfUploadFile;
	}
}