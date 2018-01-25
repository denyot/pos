package org.eredlab.g4.ccl.net.ftp;

import java.io.IOException;
import java.io.InputStream;

/** @deprecated */
public abstract interface FTPFileListParser
{
  public abstract FTPFile[] parseFileList(InputStream paramInputStream, String paramString)
    throws IOException;

  public abstract FTPFile[] parseFileList(InputStream paramInputStream)
    throws IOException;
}