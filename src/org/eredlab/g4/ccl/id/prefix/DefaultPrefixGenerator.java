package org.eredlab.g4.ccl.id.prefix;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.eredlab.g4.ccl.id.CreatePrefixException;
import org.eredlab.g4.ccl.id.PrefixGenerator;

public class DefaultPrefixGenerator
  implements PrefixGenerator
{
  private String prefix = "";

  private boolean withDate = false;

  private String pattern = "yyyyMMdd";

  public String create() throws CreatePrefixException {
    StringBuffer sb = new StringBuffer();
    sb.append(this.prefix);
    if (this.withDate) {
      sb.append(getFormatedDate());
    }
    return sb.toString();
  }

  private String getFormatedDate() {
    SimpleDateFormat sdf = new SimpleDateFormat(
      this.pattern);
    Date now = new Date();
    return sdf.format(now);
  }

  public String getPrefix() {
    return this.prefix;
  }

  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }

  public boolean isWithDate() {
    return this.withDate;
  }

  public void setWithDate(boolean withDate) {
    this.withDate = withDate;
  }

  public String getPattern() {
    return this.pattern;
  }

  public void setPattern(String pattern) {
    this.pattern = pattern;
  }
}