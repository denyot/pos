package org.eredlab.g4.rif.report.fcf;

import java.util.HashMap;

public class GraphConfig extends HashMap {
	public GraphConfig() {
		put("baseFont", "宋体");
		put("baseFontSize", "12");
		put("canvasBorderThickness", "1");
	}

	public void setCaption(String pCaption) {
		put("caption", pCaption);
	}

	public void setSubcaption(String pSubcaption) {
		put("subcaption", pSubcaption);
	}

	public void setXAxisName(String pXAxisName) {
		put("xAxisName", pXAxisName);
	}

	public void setYAxisName(String pYAxisName) {
		put("yAxisName", pYAxisName);
	}

	public void setBaseFont(String pBaseFont) {
		put("baseFont", pBaseFont);
	}

	public void setBaseFontSize(String pBaseFontSize) {
		put("baseFontSize", pBaseFontSize);
	}

	public void setNumberPrefix(String pNumberPrefix) {
		put("numberPrefix", pNumberPrefix);
	}

	public void setCanvasBorderThickness(Boolean pCanvasBorderThickness) {
		put("canvasBorderThickness",
				pCanvasBorderThickness.booleanValue() ? "1" : "0");
	}

	public void setCanvasBorderColor(String pCanvasBorderColor) {
		put("CanvasBorderColor", pCanvasBorderColor);
	}

	public void setShowNames(Boolean pShowNames) {
		put("showNames", pShowNames.booleanValue() ? "1" : "0");
	}

	public void setShowValues(Boolean pShowValues) {
		put("showValues", pShowValues.booleanValue() ? "1" : "0");
	}
}