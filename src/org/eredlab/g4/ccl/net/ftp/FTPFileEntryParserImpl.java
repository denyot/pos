package org.eredlab.g4.ccl.net.ftp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;

public abstract class FTPFileEntryParserImpl
  implements FTPFileEntryParser, FTPFileListParser
{
  public FTPFile[] parseFileList(InputStream listStream, String encoding)
    throws IOException
  {
    FTPFileList ffl = FTPFileList.create(listStream, this, encoding);
    return ffl.getFiles();
  }

  /** @deprecated */
  public FTPFile[] parseFileList(InputStream listStream)
    throws IOException
  {
    return parseFileList(listStream, null);
  }

  public String readNextEntry(BufferedReader reader)
    throws IOException
  {
    return reader.readLine();
  }

  public List preParse(List original)
  {
    Iterator it = original.iterator();
    while (it.hasNext()) {
      String entry = (String)it.next();
      if (parseFTPEntry(entry) != null) break;
      it.remove();
    }

    return original;
  }
}