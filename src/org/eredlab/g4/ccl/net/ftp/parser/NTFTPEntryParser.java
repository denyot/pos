package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.ParseException;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFile;

public class NTFTPEntryParser extends ConfigurableFTPFileEntryParserImpl
{
  private static final String DEFAULT_DATE_FORMAT = "MM-dd-yy hh:mma";
  private static final String REGEX = "(\\S+)\\s+(\\S+)\\s+(<DIR>)?\\s*([0-9]+)?\\s+(\\S.*)";

  public NTFTPEntryParser()
  {
    this(null);
  }

  public NTFTPEntryParser(FTPClientConfig config)
  {
    super("(\\S+)\\s+(\\S+)\\s+(<DIR>)?\\s*([0-9]+)?\\s+(\\S.*)");
    configure(config);
  }

  public FTPFile parseFTPEntry(String entry)
  {
    FTPFile f = new FTPFile();
    f.setRawListing(entry);

    if (matches(entry))
    {
      String datestr = group(1) + " " + group(2);
      String dirString = group(3);
      String size = group(4);
      String name = group(5);
      try
      {
        f.setTimestamp(super.parseTimestamp(datestr));
      }
      catch (ParseException e)
      {
        return null;
      }

      if ((name == null) || (name.equals(".")) || (name.equals("..")))
      {
        return null;
      }
      f.setName(name);

      if ("<DIR>".equals(dirString))
      {
        f.setType(1);
        f.setSize(0L);
      }
      else
      {
        f.setType(0);
        if (size != null)
        {
          f.setSize(Long.parseLong(size));
        }
      }
      return f;
    }
    return null;
  }

  public FTPClientConfig getDefaultConfiguration()
  {
    return new FTPClientConfig(
      "WINDOWS", 
      "MM-dd-yy hh:mma", 
      null, null, null, null);
  }
}