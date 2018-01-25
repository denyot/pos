package org.eredlab.g4.rif.report.fcf;

import java.util.HashMap;
import java.util.List;

public class CategoriesConfig extends HashMap {
	public CategoriesConfig() {
		put("font", "宋体");
		put("fontSize", "12");
	}

	public void setFont(String pFoneName) {
		put("font", pFoneName);
	}

	public void setFontSize(String pFontSize) {
		put("fontSize", pFontSize);
	}

	public void setFontColor(String pFontColor) {
		put("fontColor", pFontColor);
	}

	public void setCategories(List pCategoriesList) {
		put("categories", pCategoriesList);
	}

	public List getCategories() {
		return (List) get("categories");
	}
}