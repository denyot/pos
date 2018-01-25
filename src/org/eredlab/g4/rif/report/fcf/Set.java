package org.eredlab.g4.rif.report.fcf;

import java.util.HashMap;

public class Set extends HashMap {
	public void setName(String pName) {
		put("name", pName);
	}

	public void setValue(String string) {
		put("value", string);
	}

	public void setColor(String pColor) {
		put("color", pColor);
	}

	public void setIsSliced(String pIsSliced) {
		put("isSliced", pIsSliced);
	}

	public void setHoverText(String pHoverText) {
		put("hoverText", pHoverText);
	}

	public void setAlpha(String pAlpha) {
		put("alpha", pAlpha);
	}

	public void setJsFunction(String pFunction) {
		put("link", "JavaScript:" + pFunction + ";");
	}

	public void setLink(String pLink) {
		put("link", "n-" + pLink);
	}
}