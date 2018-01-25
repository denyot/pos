package org.eredlab.g4.rif.resource.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.Iterator;
import java.util.Vector;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.FileSet;
import org.eredlab.g4.rif.resource.util.MD5;

public class MD5FileNameTask extends Task {
	private String out;
	private Vector filesets = new Vector();
	private MD5 m = new MD5();

	public void addFileset(FileSet fileset) {
		this.filesets.add(fileset);
	}

	protected void validate() {
		if (this.filesets.size() < 1)
			throw new BuildException("没有设置文件集!");
	}

	public void execute() {
    validate();
    File dir = new File(this.out);
    if ((!dir.exists()) && 
      (!dir.mkdirs()))
      throw new BuildException("创建目录:" + dir + "失败!");
    String[] includedFiles;
    int i;
    for (Iterator itFSets = this.filesets.iterator(); itFSets.hasNext(); ) {
      FileSet fs = (FileSet)itFSets.next();
      DirectoryScanner ds = fs.getDirectoryScanner(getProject());
      includedFiles = ds.getIncludedFiles();
      i = 0; 
      continue;
//      String filename = "/" + includedFiles[i].replace('\\', '/');
//      File base = ds.getBasedir();
//      File found = new File(base, includedFiles[i]);
//      String newFileName = "G4Res_" + this.m.getMD5ofStr(filename) + 
//        ".g4";
//      String outFile = this.out + "/" + newFileName;
//      System.out.println("处理文件:" + filename + "...");
//      fileOut(found, outFile);
//      System.out.println("处理文件:" + filename + "成功!");
//
//      i++;
    }
  }

	private void fileOut(File pSrcFile, String pOutputFile) throws BuildException {
		InputStream is = null;
		try {
			is = new FileInputStream(pSrcFile);
		} catch (FileNotFoundException e) {
			throw new BuildException("读文件:" + pSrcFile + "失败!", e);
		}
		OutputStream outputStream = null;
		try {
			outputStream = new FileOutputStream(pOutputFile);
		} catch (FileNotFoundException e) {
			throw new BuildException("创建输出流:" + pOutputFile + "失败!", e);
		}
		byte[] buf = new byte[2048];
		try {
			int len;
			while ((len = is.read(buf)) > 0) {
				outputStream.write(buf, 0, len);
			}
		} catch (IOException e) {
			throw new BuildException("处理文件:" + pSrcFile + "失败!", e);
		}
		int len;
	}

	public String getOut() {
		return this.out;
	}

	public void setOut(String out) {
		this.out = out;
	}
}