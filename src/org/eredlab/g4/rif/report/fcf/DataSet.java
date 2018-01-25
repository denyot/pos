package org.eredlab.g4.rif.report.fcf;

import java.util.HashMap;
import java.util.List;

public class DataSet extends HashMap {
	public void setSeriesname(String seriesname) {
		put("seriesname", seriesname);
	}

	public void setColor(String color) {
		put("color", color);
	}

	public void setData(List list) {
		put("dataList", list);
	}

	public void setAreaAlpha(String pAreaAlpha) {
		put("areaAlpha", pAreaAlpha);
	}

	public void setShowAreaBorder(Boolean pShowAreaBorder) {
		put("showAreaBorder", pShowAreaBorder.booleanValue() ? "1" : "0");
	}

	public void setAreaBorderThickness(String pAreaBorderThickness) {
		put("areaBorderThickness", pAreaBorderThickness);
	}

	public void setAreaBorderColor(String pAreaBorderColor) {
		put("areaBorderColor", pAreaBorderColor);
	}

	public void setShowValues(Boolean pShowValues) {
		put("showValues", pShowValues.booleanValue() ? "1" : "0");
	}

	public void setParentYAxis(Boolean parentYAxis) {
		put("parentYAxis", parentYAxis.booleanValue() ? "S" : "");
	}

	public List getData() {
		return (List) get("dataList");
	}
}