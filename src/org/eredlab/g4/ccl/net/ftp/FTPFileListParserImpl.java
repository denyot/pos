package org.eredlab.g4.ccl.net.ftp;

import org.eredlab.g4.ccl.net.ftp.parser.RegexFTPFileEntryParserImpl;

/** @deprecated */
public abstract class FTPFileListParserImpl extends RegexFTPFileEntryParserImpl
{
  public FTPFileListParserImpl(String regex)
  {
    super(regex);
  }
}