package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.ParseException;
import java.util.Calendar;
import org.eredlab.g4.ccl.net.ftp.Configurable;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;

public abstract class ConfigurableFTPFileEntryParserImpl extends RegexFTPFileEntryParserImpl
  implements Configurable
{
  private FTPTimestampParser timestampParser;

  public ConfigurableFTPFileEntryParserImpl(String regex)
  {
    super(regex);
    this.timestampParser = new FTPTimestampParserImpl();
  }

  public Calendar parseTimestamp(String timestampStr)
    throws ParseException
  {
    return this.timestampParser.parseTimestamp(timestampStr);
  }

  public void configure(FTPClientConfig config)
  {
    if ((this.timestampParser instanceof Configurable)) {
      FTPClientConfig defaultCfg = getDefaultConfiguration();
      if (config != null) {
        if (config.getDefaultDateFormatStr() == null) {
          config.setDefaultDateFormatStr(defaultCfg.getDefaultDateFormatStr());
        }
        if (config.getRecentDateFormatStr() == null) {
          config.setRecentDateFormatStr(defaultCfg.getRecentDateFormatStr());
        }
        ((Configurable)this.timestampParser).configure(config);
      } else {
        ((Configurable)this.timestampParser).configure(defaultCfg);
      }
    }
  }

  protected abstract FTPClientConfig getDefaultConfiguration();
}