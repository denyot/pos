package org.eredlab.g4.rif.report.excel;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.util.G4Utils;

public class ExcelTemplate {
	private Log log = LogFactory.getLog(ExcelTemplate.class);

	private List staticObject = null;
	private List parameterObjct = null;
	private List fieldObjct = null;
	private List variableObject = null;
	private String templatePath = null;

	public ExcelTemplate(String pTemplatePath) {
		this.templatePath = pTemplatePath;
	}

	public ExcelTemplate() {
	}

	public void parse(HttpServletRequest request) {
		this.staticObject = new ArrayList();
		this.parameterObjct = new ArrayList();
		this.fieldObjct = new ArrayList();
		this.variableObject = new ArrayList();
		if (G4Utils.isEmpty(this.templatePath)) {
			this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\nExcel模板路径不能为空!");
		}
		
		InputStream is = request.getSession().getServletContext()
				.getResourceAsStream(this.templatePath);
		if (G4Utils.isEmpty(is)) {
			this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n未找到模板文件,请确认模板路径是否正确["
					+ this.templatePath + "]");
		}
		Workbook workbook = null;
		try {
			workbook = Workbook.getWorkbook(is);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Sheet sheet = workbook.getSheet(0);
		if (G4Utils.isNotEmpty(sheet)) {
			int rows = sheet.getRows();
			for (int k = 0; k < rows; k++) {
				Cell[] cells = sheet.getRow(k);
				for (int j = 0; j < cells.length; j++) {
					String cellContent = cells[j].getContents().trim();
					if (!G4Utils.isEmpty(cellContent))
						if ((cellContent.indexOf("$P") != -1)
								|| (cellContent.indexOf("$p") != -1))
							this.parameterObjct.add(cells[j]);
						else if ((cellContent.indexOf("$F") != -1)
								|| (cellContent.indexOf("$f") != -1))
							this.fieldObjct.add(cells[j]);
						else if ((cellContent.indexOf("$V") != -1)
								|| (cellContent.indexOf("$v") != -1))
							this.variableObject.add(cells[j]);
						else
							this.staticObject.add(cells[j]);
				}
			}
		} else {
			this.log.error("模板工作表对象不能为空!");
		}
	}

	public void addStaticObject(Cell cell) {
		this.staticObject.add(cell);
	}

	public void addParameterObjct(Cell cell) {
		this.parameterObjct.add(cell);
	}

	public void addFieldObjct(Cell cell) {
		this.fieldObjct.add(cell);
	}

	public List getStaticObject() {
		return this.staticObject;
	}

	public List getParameterObjct() {
		return this.parameterObjct;
	}

	public List getFieldObjct() {
		return this.fieldObjct;
	}

	public String getTemplatePath() {
		return this.templatePath;
	}

	public void setTemplatePath(String templatePath) {
		this.templatePath = templatePath;
	}

	public List getVariableObject() {
		return this.variableObject;
	}
}