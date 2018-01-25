package org.eredlab.g4.ccl.net.ftp.parser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.StringTokenizer;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFile;
import org.eredlab.g4.ccl.net.ftp.FTPListParseEngine;

public class VMSFTPEntryParser extends ConfigurableFTPFileEntryParserImpl
{
  private static final String DEFAULT_DATE_FORMAT = "d-MMM-yyyy HH:mm:ss";
  private static final String REGEX = "(.*;[0-9]+)\\s*(\\d+)/\\d+\\s*(\\S+)\\s+(\\S+)\\s+\\[(([0-9$A-Za-z_]+)|([0-9$A-Za-z_]+),([0-9$a-zA-Z_]+))\\]?\\s*\\([a-zA-Z]*,[a-zA-Z]*,[a-zA-Z]*,[a-zA-Z]*\\)";

  public VMSFTPEntryParser()
  {
    this(null);
  }

  public VMSFTPEntryParser(FTPClientConfig config)
  {
    super("(.*;[0-9]+)\\s*(\\d+)/\\d+\\s*(\\S+)\\s+(\\S+)\\s+\\[(([0-9$A-Za-z_]+)|([0-9$A-Za-z_]+),([0-9$a-zA-Z_]+))\\]?\\s*\\([a-zA-Z]*,[a-zA-Z]*,[a-zA-Z]*,[a-zA-Z]*\\)");
    configure(config);
  }

  public FTPFile[] parseFileList(InputStream listStream)
    throws IOException
  {
    FTPListParseEngine engine = new FTPListParseEngine(this);
    engine.readServerList(listStream);
    return engine.getFiles();
  }

  public FTPFile parseFTPEntry(String entry)
  {
    long longBlock = 512L;

    if (matches(entry))
    {
      FTPFile f = new FTPFile();
      f.setRawListing(entry);
      String name = group(1);
      String size = group(2);
      String datestr = group(3) + " " + group(4);
      String owner = group(5);
      try
      {
        f.setTimestamp(super.parseTimestamp(datestr));
      }
      catch (ParseException e)
      {
        return null;
      }

      StringTokenizer t = new StringTokenizer(owner, ",");
      String user;
      String grp;
      switch (t.countTokens()) {
      case 1:
        grp = null;
        user = t.nextToken();
        break;
      case 2:
        grp = t.nextToken();
        user = t.nextToken();
        break;
      default:
        grp = null;
        user = null;
      }

      if (name.lastIndexOf(".DIR") != -1)
      {
        f.setType(1);
      }
      else
      {
        f.setType(0);
      }

      if (isVersioning())
      {
        f.setName(name);
      }
      else
      {
        name = name.substring(0, name.lastIndexOf(";"));
        f.setName(name);
      }

      long sizeInBytes = Long.parseLong(size) * longBlock;
      f.setSize(sizeInBytes);

      f.setGroup(grp);
      f.setUser(user);

      return f;
    }
    return null;
  }

  public String readNextEntry(BufferedReader reader)
    throws IOException
  {
    String line = reader.readLine();
    StringBuffer entry = new StringBuffer();
    while (line != null)
    {
      if ((line.startsWith("Directory")) || (line.startsWith("Total"))) {
        line = reader.readLine();
      }
      else
      {
        entry.append(line);
        if (line.trim().endsWith(")"))
        {
          break;
        }
        line = reader.readLine();
      }
    }
    return entry.length() == 0 ? null : entry.toString();
  }

  protected boolean isVersioning() {
    return false;
  }

  protected FTPClientConfig getDefaultConfiguration()
  {
    return new FTPClientConfig(
      "VMS", 
      "d-MMM-yyyy HH:mm:ss", 
      null, null, null, null);
  }
}