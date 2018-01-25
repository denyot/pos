package org.eredlab.g4.rif.report.excel;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import jxl.Cell;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.datastructure.impl.BasePo;
import org.eredlab.g4.ccl.datastructure.impl.BaseVo;
import org.eredlab.g4.ccl.util.G4Utils;

public class ExcelFiller {
	private Log log = LogFactory.getLog(ExcelFiller.class);

	private ExcelTemplate excelTemplate = null;

	private ExcelData excelData = null;

	public ExcelFiller() {
	}

	public ExcelFiller(ExcelTemplate pExcelTemplate, ExcelData pExcelData) {
		setExcelData(pExcelData);
		setExcelTemplate(pExcelTemplate);
	}

	public ByteArrayOutputStream fill(HttpServletRequest request) {
		WritableSheet wSheet = null;
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			InputStream is = request.getSession().getServletContext()
					.getResourceAsStream(getExcelTemplate().getTemplatePath());
			Workbook wb = Workbook.getWorkbook(is);
			WritableWorkbook wwb = Workbook.createWorkbook(bos, wb);
			wSheet = wwb.getSheet(0);
			fillStatics(wSheet);
			fillParameters(wSheet);
			fillFields(wSheet);
			G4Utils.isNotEmpty(getExcelData().getFieldsList());

			wwb.write();
			wwb.close();
			wb.close();
		} catch (Exception e) {
			this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n基于模板生成可写工作表出错了!");
			e.printStackTrace();
		}
		return bos;
	}

	private void fillStatics(WritableSheet wSheet) {
		List statics = getExcelTemplate().getStaticObject();
		for (int i = 0; i < statics.size(); i++) {
			Cell cell = (Cell) statics.get(i);
			Label label = new Label(cell.getColumn(), cell.getRow(), cell
					.getContents());
			label.setCellFormat(cell.getCellFormat());
			try {
				wSheet.addCell(label);
			} catch (Exception e) {
				this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n写入静态对象发生错误!");
				e.printStackTrace();
			}
		}
	}

	private void fillParameters(WritableSheet wSheet) {
		List parameters = getExcelTemplate().getParameterObjct();
		Dto parameterDto = getExcelData().getParametersDto();
		for (int i = 0; i < parameters.size(); i++) {
			Cell cell = (Cell) parameters.get(i);
			String key = getKey(cell.getContents().trim());
			String type = getType(cell.getContents().trim());
			try {
				if (type.equalsIgnoreCase("number")) {
					Number number = new Number(cell.getColumn(), cell.getRow(),
							parameterDto.getAsBigDecimal(key).doubleValue());
					number.setCellFormat(cell.getCellFormat());
					wSheet.addCell(number);
				} else {
					Label label = new Label(cell.getColumn(), cell.getRow(),
							parameterDto.getAsString(key));
					label.setCellFormat(cell.getCellFormat());
					wSheet.addCell(label);
				}
			} catch (Exception e) {
				this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n写入表格参数对象发生错误!");
				e.printStackTrace();
			}
		}
	}

	private void fillFields(WritableSheet wSheet) throws Exception {
		List fields = getExcelTemplate().getFieldObjct();
		List fieldList = getExcelData().getFieldsList();
		for (int j = 0; j < fieldList.size(); j++) {
			Dto dataDto = new BaseDto();
			Object object = fieldList.get(j);
			if ((object instanceof BasePo)) {
				BasePo domain = (BasePo) object;
				dataDto.putAll(domain.toDto());
			} else if ((object instanceof BaseVo)) {
				BaseVo vo = (BaseVo) object;
				dataDto.putAll(vo.toDto());
			} else if ((object instanceof BaseDto)) {
				Dto dto = (BaseDto) object;
				dataDto.putAll(dto);
			} else {
				this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n不支持的数据类型!");
			}
			for (int i = 0; i < fields.size(); i++) {
				Cell cell = (Cell) fields.get(i);
				String key = getKey(cell.getContents().trim());
				String type = getType(cell.getContents().trim());
				try {
					if (type.equalsIgnoreCase("number")) {
						Number number = new Number(cell.getColumn(), cell
								.getRow()
								+ j, dataDto.getAsBigDecimal(key).doubleValue());
						number.setCellFormat(cell.getCellFormat());
						wSheet.addCell(number);
					} else {
						Label label = new Label(cell.getColumn(), cell.getRow()
								+ j, dataDto.getAsString(key));
						label.setCellFormat(cell.getCellFormat());
						wSheet.addCell(label);
					}
				} catch (Exception e) {
					this.log
							.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n写入表格字段对象发生错误!");
					e.printStackTrace();
				}
			}
		}
		int row = 0;
		row += fieldList.size();
		if (G4Utils.isEmpty(fieldList)) {
			if (G4Utils.isNotEmpty(fields)) {
				Cell cell = (Cell) fields.get(0);
				row = cell.getRow();
				wSheet.removeRow(row + 5);
				wSheet.removeRow(row + 4);
				wSheet.removeRow(row + 3);
				wSheet.removeRow(row + 2);
				wSheet.removeRow(row + 1);
				wSheet.removeRow(row);
			}
		} else {
			Cell cell = (Cell) fields.get(0);
			row += cell.getRow();
			fillVariables(wSheet, row);
		}
	}

	private void fillVariables(WritableSheet wSheet, int row) {
		List variables = getExcelTemplate().getVariableObject();
		Dto parameterDto = getExcelData().getParametersDto();
		for (int i = 0; i < variables.size(); i++) {
			Cell cell = (Cell) variables.get(i);
			String key = getKey(cell.getContents().trim());
			String type = getType(cell.getContents().trim());
			try {
				if (type.equalsIgnoreCase("number")) {
					Number number = new Number(cell.getColumn(), row,
							parameterDto.getAsBigDecimal(key).doubleValue());
					number.setCellFormat(cell.getCellFormat());
					wSheet.addCell(number);
				} else {
					String content = parameterDto.getAsString(key);
					if ((G4Utils.isEmpty(content))
							&& (!key.equalsIgnoreCase("nbsp"))) {
						content = key;
					}
					Label label = new Label(cell.getColumn(), row, content);
					label.setCellFormat(cell.getCellFormat());
					wSheet.addCell(label);
				}
			} catch (Exception e) {
				this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n写入表格变量对象发生错误!");
				e.printStackTrace();
			}
		}
	}

	private static String getKey(String pKey) {
		String key = null;
		int index = pKey.indexOf(":");
		if (index == -1)
			key = pKey.substring(3, pKey.length() - 1);
		else {
			key = pKey.substring(3, index);
		}
		return key;
	}

	private static String getType(String pType) {
		String type = "label";
		if ((pType.indexOf(":n") != -1) || (pType.indexOf(":N") != -1)) {
			type = "number";
		}
		return type;
	}

	public ExcelTemplate getExcelTemplate() {
		return this.excelTemplate;
	}

	public void setExcelTemplate(ExcelTemplate excelTemplate) {
		this.excelTemplate = excelTemplate;
	}

	public ExcelData getExcelData() {
		return this.excelData;
	}

	public void setExcelData(ExcelData excelData) {
		this.excelData = excelData;
	}
}