package org.eredlab.g4.ccl.net.ftp.parser;

import org.eredlab.g4.ccl.net.ftp.FTPFile;
import org.eredlab.g4.ccl.net.ftp.FTPFileEntryParser;
import org.eredlab.g4.ccl.net.ftp.FTPFileEntryParserImpl;

public class CompositeFileEntryParser extends FTPFileEntryParserImpl
{
  private final FTPFileEntryParser[] ftpFileEntryParsers;
  private FTPFileEntryParser cachedFtpFileEntryParser;

  public CompositeFileEntryParser(FTPFileEntryParser[] ftpFileEntryParsers)
  {
    this.cachedFtpFileEntryParser = null;
    this.ftpFileEntryParsers = ftpFileEntryParsers;
  }

  public FTPFile parseFTPEntry(String listEntry)
  {
    if (this.cachedFtpFileEntryParser != null)
    {
      FTPFile matched = this.cachedFtpFileEntryParser.parseFTPEntry(listEntry);
      if (matched != null)
      {
        return matched;
      }
    }
    else
    {
      for (int iterParser = 0; iterParser < this.ftpFileEntryParsers.length; iterParser++)
      {
        FTPFileEntryParser ftpFileEntryParser = this.ftpFileEntryParsers[iterParser];

        FTPFile matched = ftpFileEntryParser.parseFTPEntry(listEntry);
        if (matched != null)
        {
          this.cachedFtpFileEntryParser = ftpFileEntryParser;
          return matched;
        }
      }
    }
    return null;
  }
}