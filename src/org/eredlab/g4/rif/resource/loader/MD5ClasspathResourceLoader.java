package org.eredlab.g4.rif.resource.loader;

import org.eredlab.g4.rif.resource.util.MD5;

public class MD5ClasspathResourceLoader extends ClasspathResourceLoader {
	public static final String FILE_PREFIX = "G4Res_";
	public static final String FILE_POSTFIX = ".g4";
	private MD5 m = new MD5();

	protected String urlMapping(String pUri) {
		String filename = pUri.replace('\\', '/');
		return "G4Res_" + this.m.getMD5ofStr(filename) + ".g4";
	}
}