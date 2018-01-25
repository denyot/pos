package org.eredlab.g4.ccl.net.ftp.parser;

import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFileEntryParser;

public abstract interface FTPFileEntryParserFactory
{
  public abstract FTPFileEntryParser createFileEntryParser(String paramString)
    throws ParserInitializationException;

  public abstract FTPFileEntryParser createFileEntryParser(FTPClientConfig paramFTPClientConfig)
    throws ParserInitializationException;
}