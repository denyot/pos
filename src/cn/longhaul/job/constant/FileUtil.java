package cn.longhaul.job.constant;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class FileUtil {
	public static void readToBuffer(StringBuffer buffer, InputStream is)
			throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		String line = reader.readLine();
		while (line != null) {
			buffer.append(line);
			line = reader.readLine();
		}
		is.close();
		reader.close();
	}

	public static void writeFromBuffer(String buffer, OutputStream os)
			throws IOException {
		PrintWriter writer = new PrintWriter(new OutputStreamWriter(os));
		writer.println(buffer);
		writer.flush();
		writer.close();
	}

	public void copyStream(InputStream is, OutputStream os) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		PrintWriter writer = new PrintWriter(new OutputStreamWriter(os));
		String line = reader.readLine();
		while (line != null) {
			writer.println(line);
			line = reader.readLine();
		}
		writer.flush();
	}

	public void copyTextFile(String inFilename, String outFilename)
			throws IOException {
		InputStream is = new FileInputStream(inFilename);
		OutputStream os = new FileOutputStream(outFilename);
		copyStream(is, os);
		is.close();
		os.close();
	}

	public static void main(String[] args) throws Exception {
		int sw = 2;
		FileUtil test = new FileUtil();
		StringBuffer buffer = null;
		switch (sw) {
		case 1:
			buffer = new StringBuffer();
			readToBuffer(buffer, test.getClass().getResourceAsStream(
					"email.txt"));
			System.out.println(buffer);

			break;
		case 2:
			buffer = new StringBuffer("Only a test\n");
			String a = test.getClass().getClassLoader().getResource(".")
					.getPath();
			String b = test.getClass().getResource("").getPath();
			String c = test.getClass().getResource(" ").getPath();
			String d = test.getClass().getResource("/").getPath();
			System.out.println(a);
			System.out.println(b);
			System.out.println(c);
			System.out.println(d);
			writeFromBuffer(buffer.toString(), new FileOutputStream(b
					+ "/email.txt"));

			break;
		case 3:
			test.copyTextFile("E:\\test.txt", "E:\\r.txt");
		}
	}
}