package org.eredlab.g4.ccl.net.ftp.parser;

import org.eredlab.g4.ccl.net.ftp.Configurable;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFileEntryParser;

public class DefaultFTPFileEntryParserFactory
  implements FTPFileEntryParserFactory
{
  private FTPClientConfig config = null;

  public FTPFileEntryParser createFileEntryParser(String key)
  {
    Class parserClass = null;
    FTPFileEntryParser parser = null;
    try
    {
      parserClass = Class.forName(key);
      parser = (FTPFileEntryParser)parserClass.newInstance();
    }
    catch (ClassNotFoundException e)
    {
      String ukey = null;
      if (key != null)
      {
        ukey = key.toUpperCase();
      }
      if (ukey.indexOf("UNIX") >= 0)
      {
        parser = createUnixFTPEntryParser();
      }
      else if (ukey.indexOf("VMS") >= 0)
      {
        parser = createVMSVersioningFTPEntryParser();
      }
      else if (ukey.indexOf("WINDOWS") >= 0)
      {
        parser = createNTFTPEntryParser();
      }
      else if (ukey.indexOf("OS/2") >= 0)
      {
        parser = createOS2FTPEntryParser();
      }
      else if (ukey.indexOf("OS/400") >= 0)
      {
        parser = createOS400FTPEntryParser();
      }
      else if (ukey.indexOf("MVS") >= 0)
      {
        parser = createMVSEntryParser();
      }
      else
      {
        throw new ParserInitializationException("Unknown parser type: " + key);
      }
    }
    catch (ClassCastException e)
    {
      throw new ParserInitializationException(parserClass.getName() + 
        " does not implement the interface " + 
        "org.apache.commons.net.ftp.FTPFileEntryParser.", e);
    }
    catch (Throwable e)
    {
      throw new ParserInitializationException("Error initializing parser", e);
    }

    if ((parser instanceof Configurable)) {
      ((Configurable)parser).configure(this.config);
    }
    return parser;
  }

  public FTPFileEntryParser createFileEntryParser(FTPClientConfig config)
    throws ParserInitializationException
  {
    this.config = config;
    String key = config.getServerSystemKey();
    return createFileEntryParser(key);
  }

  public FTPFileEntryParser createUnixFTPEntryParser()
  {
    return new UnixFTPEntryParser();
  }

  public FTPFileEntryParser createVMSVersioningFTPEntryParser()
  {
    return new VMSVersioningFTPEntryParser();
  }

  public FTPFileEntryParser createNTFTPEntryParser()
  {
    if ((this.config != null) && ("WINDOWS".equals(
      this.config.getServerSystemKey())))
    {
      return new NTFTPEntryParser();
    }
    return new CompositeFileEntryParser(
      new FTPFileEntryParser[] { 
      new NTFTPEntryParser(), 
      new UnixFTPEntryParser() });
  }

  public FTPFileEntryParser createOS2FTPEntryParser()
  {
    return new OS2FTPEntryParser();
  }

  public FTPFileEntryParser createOS400FTPEntryParser()
  {
    if ((this.config != null) && 
      ("OS/400".equals(this.config.getServerSystemKey())))
    {
      return new OS400FTPEntryParser();
    }
    return new CompositeFileEntryParser(
      new FTPFileEntryParser[] { 
      new OS400FTPEntryParser(), 
      new UnixFTPEntryParser() });
  }

  public FTPFileEntryParser createMVSEntryParser()
  {
    return new MVSFTPEntryParser();
  }
}