package org.eredlab.g4.rif.resource.util;

public class AntPathMatcher {
	public static final String DEFAULT_PATH_SEPARATOR = "/";
	private String pathSeparator = "/";

	public void setPathSeparator(String pathSeparator) {
		this.pathSeparator = (pathSeparator != null ? pathSeparator : "/");
	}

	public boolean isPattern(String str) {
		return (str.indexOf('*') != -1) || (str.indexOf('?') != -1);
	}

	public boolean match(String pattern, String str) {
		if (str == null) {
			return false;
		}
		if (pattern == null) {
			return false;
		}
		if (str.startsWith(this.pathSeparator) != pattern
				.startsWith(this.pathSeparator)) {
			return false;
		}

		String[] patDirs = StringUtils.tokenizeToStringArray(pattern,
				this.pathSeparator);
		String[] strDirs = StringUtils.tokenizeToStringArray(str,
				this.pathSeparator);

		int patIdxStart = 0;
		int patIdxEnd = patDirs.length - 1;
		int strIdxStart = 0;
		int strIdxEnd = strDirs.length - 1;

		while ((patIdxStart <= patIdxEnd) && (strIdxStart <= strIdxEnd)) {
			String patDir = patDirs[patIdxStart];
			if (patDir.equals("**")) {
				break;
			}
			if (!matchStrings(patDir, strDirs[strIdxStart])) {
				return false;
			}
			patIdxStart++;
			strIdxStart++;
		}

		if (strIdxStart > strIdxEnd) {
			if ((patIdxStart == patIdxEnd)
					&& (patDirs[patIdxStart].equals("*"))
					&& (str.endsWith(this.pathSeparator))) {
				return true;
			}
			for (int i = patIdxStart; i <= patIdxEnd; i++) {
				if (!patDirs[i].equals("**")) {
					return false;
				}
			}
			return true;
		}
		if (patIdxStart > patIdxEnd) {
			return false;
		}

		while ((patIdxStart <= patIdxEnd) && (strIdxStart <= strIdxEnd)) {
			String patDir = patDirs[patIdxEnd];
			if (patDir.equals("**")) {
				break;
			}
			if (!matchStrings(patDir, strDirs[strIdxEnd])) {
				return false;
			}
			patIdxEnd--;
			strIdxEnd--;
		}
		if (strIdxStart > strIdxEnd) {
			for (int i = patIdxStart; i <= patIdxEnd; i++) {
				if (!patDirs[i].equals("**")) {
					return false;
				}
			}
			return true;
		}

		while ((patIdxStart != patIdxEnd) && (strIdxStart <= strIdxEnd)) {
			//int i;
			int patIdxTmp = -1;
			for (int i = patIdxStart + 1; i <= patIdxEnd; i++) {
				if (patDirs[i].equals("**")) {
					patIdxTmp = i;
					break;
				}
			}
			if (patIdxTmp == patIdxStart + 1) {
				patIdxStart++;
			} else {
				int patLength = patIdxTmp - patIdxStart - 1;
				int strLength = strIdxEnd - strIdxStart + 1;
				int foundIdx = -1;
				for (int i = 0; i <= strLength - patLength; i++) {
					for (int j = 0; j < patLength; j++) {
						String subPat = patDirs[(patIdxStart + j + 1)];
						String subStr = strDirs[(strIdxStart + i + j)];
						if (!matchStrings(subPat, subStr)) {
							break;
						}
					}
					foundIdx = strIdxStart + i;
					break;
				}

				if (foundIdx == -1) {
					return false;
				}

				patIdxStart = patIdxTmp;
				strIdxStart = foundIdx + patLength;
			}
		}
		for (int i = patIdxStart; i <= patIdxEnd; i++) {
			if (!patDirs[i].equals("**")) {
				return false;
			}
		}

		return true;
	}

	private boolean matchStrings(String pattern, String str) {
		char[] patArr = pattern.toCharArray();
		char[] strArr = str.toCharArray();
		int patIdxStart = 0;
		int patIdxEnd = patArr.length - 1;
		int strIdxStart = 0;
		int strIdxEnd = strArr.length - 1;

		boolean containsStar = false;
		for (int i = 0; i < patArr.length; i++) {
			if (patArr[i] == '*') {
				containsStar = true;
				break;
			}
		}

		if (!containsStar) {
			if (patIdxEnd != strIdxEnd) {
				return false;
			}
			for (int i = 0; i <= patIdxEnd; i++) {
				char ch = patArr[i];
				if ((ch != '?') && (ch != strArr[i])) {
					return false;
				}
			}

			return true;
		}

		if (patIdxEnd == 0)
			return true;
		char ch;
		while (((ch = patArr[patIdxStart]) != '*')
				&& (strIdxStart <= strIdxEnd)) {
			//char ch;
			if ((ch != '?') && (ch != strArr[strIdxStart])) {
				return false;
			}

			patIdxStart++;
			strIdxStart++;
		}
		if (strIdxStart > strIdxEnd) {
			for (int i = patIdxStart; i <= patIdxEnd; i++) {
				if (patArr[i] != '*') {
					return false;
				}
			}
			return true;
		}

		while (((ch = patArr[patIdxEnd]) != '*') && (strIdxStart <= strIdxEnd)) {
			int i;
			if ((ch != '?') && (ch != strArr[strIdxEnd])) {
				return false;
			}

			patIdxEnd--;
			strIdxEnd--;
		}
		if (strIdxStart > strIdxEnd) {
			for (int i = patIdxStart; i <= patIdxEnd; i++) {
				if (patArr[i] != '*') {
					return false;
				}
			}
			return true;
		}

		while ((patIdxStart != patIdxEnd) && (strIdxStart <= strIdxEnd)) {
			int patIdxTmp = -1;
			for (int i = patIdxStart + 1; i <= patIdxEnd; i++) {
				if (patArr[i] == '*') {
					patIdxTmp = i;
					break;
				}
			}
			if (patIdxTmp == patIdxStart + 1) {
				patIdxStart++;
			} else {
				int patLength = patIdxTmp - patIdxStart - 1;
				int strLength = strIdxEnd - strIdxStart + 1;
				int foundIdx = -1;
				for (int i = 0; i <= strLength - patLength; i++) {
					for (int j = 0; j < patLength; j++) {
						ch = patArr[(patIdxStart + j + 1)];
						if ((ch != '?')
								&& (ch != strArr[(strIdxStart + i + j)])) {
							break;
						}
					}

					foundIdx = strIdxStart + i;
					break;
				}

				if (foundIdx == -1) {
					return false;
				}

				patIdxStart = patIdxTmp;
				strIdxStart = foundIdx + patLength;
			}

		}

		for (int i = patIdxStart; i <= patIdxEnd; i++) {
			if (patArr[i] != '*') {
				return false;
			}
		}

		return true;
	}

	public String extractPathWithinPattern(String pattern, String path) {
		String[] patternParts = StringUtils.tokenizeToStringArray(pattern,
				this.pathSeparator);
		String[] pathParts = StringUtils.tokenizeToStringArray(path,
				this.pathSeparator);

		StringBuffer buffer = new StringBuffer();

		int puts = 0;
		for (int i = 0; i < patternParts.length; i++) {
			String patternPart = patternParts[i];
			if ((patternPart.indexOf('*') > -1)
					|| (patternPart.indexOf('?') > -1)) {
				if (puts != 0) {
					buffer.append(this.pathSeparator);
				}
				if (pathParts.length >= i + 1) {
					buffer.append(pathParts[i]);
					puts++;
				}
			}

		}

		for (int i = patternParts.length; i < pathParts.length; i++) {
			if ((puts > 0) || (i > 0)) {
				buffer.append(this.pathSeparator);
			}
			buffer.append(pathParts[i]);
		}

		return buffer.toString();
	}
}