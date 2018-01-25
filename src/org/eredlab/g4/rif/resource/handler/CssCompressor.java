package org.eredlab.g4.rif.resource.handler;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CssCompressor {
	private StringBuffer srcsb = new StringBuffer();

	public CssCompressor(Reader in) throws IOException {
		int c;
		while ((c = in.read()) != -1) {
			this.srcsb.append((char) c);
		}
	}

	public void compress(Writer out, int linebreakpos) throws IOException {
		StringBuffer sb = new StringBuffer(this.srcsb.toString());
		int startIndex;
		while ((startIndex = sb.indexOf("/*")) >= 0) {
			int endIndex = sb.indexOf("*/", startIndex + 2);
			if (endIndex >= startIndex + 2) {
				sb.delete(startIndex, endIndex + 2);
			}
		}
		String css = sb.toString();

		css = css.replaceAll("\\s+", " ");

		sb = new StringBuffer();
		Pattern p = Pattern.compile("(^|\\})(([^\\{:])+:)+([^\\{]*\\{)");
		Matcher m = p.matcher(css);
		while (m.find()) {
			String s = m.group();
			s = s.replaceAll(":", "___PSEUDOCLASSCOLON___");
			m.appendReplacement(sb, s);
		}
		m.appendTail(sb);
		css = sb.toString();
		css = css.replaceAll("\\s+([!{};:>+\\(\\)\\],])", "$1");
		css = css.replaceAll("___PSEUDOCLASSCOLON___", ":");

		css = css.replaceAll("([!{}:;>+\\(\\[,])\\s+", "$1");

		css = css.replaceAll("([^;\\}])}", "$1;}");

		css = css.replaceAll("([\\s:])(0)(px|em|%|in|cm|mm|pc|pt|ex)", "$1$2");

		css = css.replaceAll(":0 0 0 0;", ":0;");
		css = css.replaceAll(":0 0 0;", ":0;");
		css = css.replaceAll(":0 0;", ":0;");

		css = css.replaceAll("background-position:0;",
				"background-position:0 0;");

		css = css.replaceAll("(:|\\s)0+\\.(\\d+)", "$1.$2");

		p = Pattern.compile("rgb\\s*\\(\\s*([0-9,\\s]+)\\s*\\)");
		m = p.matcher(css);
		sb = new StringBuffer();
		while (m.find()) {
			String[] rgbcolors = m.group(1).split(",");
			StringBuffer hexcolor = new StringBuffer("#");
			for (int i = 0; i < rgbcolors.length; i++) {
				int val = Integer.parseInt(rgbcolors[i]);
				if (val < 16) {
					hexcolor.append("0");
				}
				hexcolor.append(Integer.toHexString(val));
			}
			m.appendReplacement(sb, hexcolor.toString());
		}
		m.appendTail(sb);
		css = sb.toString();

		p = Pattern
				.compile("([^\"'=\\s])(\\s*)#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])");
		m = p.matcher(css);
		sb = new StringBuffer();
		while (m.find()) {
			if ((m.group(3).equalsIgnoreCase(m.group(4)))
					&& (m.group(5).equalsIgnoreCase(m.group(6)))
					&& (m.group(7).equalsIgnoreCase(m.group(8))))
				m.appendReplacement(sb, m.group(1) + m.group(2) + "#"
						+ m.group(3) + m.group(5) + m.group(7));
			else {
				m.appendReplacement(sb, m.group());
			}
		}
		m.appendTail(sb);
		css = sb.toString();

		css = css.replaceAll("[^\\}]+\\{;\\}", "");

		if (linebreakpos >= 0) {
			int i = 0;
			int linestartpos = 0;
			sb = new StringBuffer(css);
			while (i < sb.length()) {
				char c = sb.charAt(i++);
				if ((c == '}') && (i - linestartpos > linebreakpos)) {
					sb.insert(i, '\n');
					linestartpos = i;
				}
			}

			css = sb.toString();
		}

		css = css.trim();

		out.write(css);
	}
}