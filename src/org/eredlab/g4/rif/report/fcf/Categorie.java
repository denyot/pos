package org.eredlab.g4.rif.report.fcf;

import java.util.HashMap;

public class Categorie extends HashMap {
	public Categorie(String pName) {
		setName(pName);
	}

	public void setName(String pName) {
		put("name", pName);
	}

	public void setHoverText(String pHoverText) {
		put("hoverText", pHoverText);
	}
}