package org.eredlab.g4.rif.report.jasper;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public class ReportData {
	private String reportFilePath;
	private Dto parametersDto;
	private List fieldsList;

	public ReportData() {
	}

	public ReportData(String pReportFilePath, Dto pParametersDto,
			List pFieldsList) {
		this.reportFilePath = pReportFilePath;
		this.parametersDto = pParametersDto;
		this.fieldsList = pFieldsList;
	}

	public String getReportFilePath() {
		return this.reportFilePath;
	}

	public void setReportFilePath(String reportFilePath) {
		this.reportFilePath = reportFilePath;
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
}