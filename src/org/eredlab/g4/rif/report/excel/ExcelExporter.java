package org.eredlab.g4.rif.report.excel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;

public class ExcelExporter {
	private String templatePath;
	private Dto parametersDto;
	private List fieldsList;
	private String filename = "Excel.xls";

	public void setData(Dto pDto, List pList) {
		this.parametersDto = pDto;
		this.fieldsList = pList;
	}

	public void export(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.setContentType("application/vnd.ms-excel");
		this.filename = G4Utils.encodeChineseDownloadFileName(request,
				getFilename());
		response.setHeader("Content-Disposition", "attachment; filename="
				+ this.filename + ";");
		ExcelData excelData = new ExcelData(this.parametersDto, this.fieldsList);
		ExcelTemplate excelTemplate = new ExcelTemplate();
		excelTemplate.setTemplatePath(getTemplatePath());
		excelTemplate.parse(request);
		ExcelFiller excelFiller = new ExcelFiller(excelTemplate, excelData);
		ByteArrayOutputStream bos = excelFiller.fill(request);
		ServletOutputStream os = response.getOutputStream();
		os.write(bos.toByteArray());
		os.flush();
		os.close();
	}

	public String getTemplatePath() {
		return this.templatePath;
	}

	public void setTemplatePath(String templatePath) {
		this.templatePath = templatePath;
	}

	public Dto getParametersDto() {
		return this.parametersDto;
	}

	public void setParametersDto(Dto parametersDto) {
		this.parametersDto = parametersDto;
	}

	public List getFieldsList() {
		return this.fieldsList;
	}

	public void setFieldsList(List fieldsList) {
		this.fieldsList = fieldsList;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}
}