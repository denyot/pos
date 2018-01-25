package org.eredlab.g4.ccl.net.ftp;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

public abstract interface FTPFileEntryParser
{
  public abstract FTPFile parseFTPEntry(String paramString);

  public abstract String readNextEntry(BufferedReader paramBufferedReader)
    throws IOException;

  public abstract List preParse(List paramList);
}