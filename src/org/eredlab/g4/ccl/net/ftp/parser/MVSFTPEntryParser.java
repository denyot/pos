package org.eredlab.g4.ccl.net.ftp.parser;

import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFile;

public class MVSFTPEntryParser extends ConfigurableFTPFileEntryParserImpl
{
  private static final String REGEX = "(.*)\\s+([^\\s]+)\\s*";
  static final String DEFAULT_DATE_FORMAT = "yyyy/MM/dd";

  public MVSFTPEntryParser()
  {
    super("(.*)\\s+([^\\s]+)\\s*");
  }

  public FTPFile parseFTPEntry(String entry)
  {
    FTPFile f = null;
    if (matches(entry))
    {
      f = new FTPFile();
      String dataSetName = group(2);
      f.setType(0);
      f.setName(dataSetName);

      return f;
    }
    return null;
  }

  protected FTPClientConfig getDefaultConfiguration()
  {
    return new FTPClientConfig(
      "MVS", 
      "yyyy/MM/dd", 
      null, null, null, null);
  }
}