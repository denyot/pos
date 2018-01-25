package org.eredlab.g4.rif.report.excel;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public class ExcelData {
	private Dto parametersDto;
	private List fieldsList;

	public ExcelData(Dto pDto, List pList) {
		setParametersDto(pDto);
		setFieldsList(pList);
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