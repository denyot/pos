package org.eredlab.g4.ccl.id.fomater;

import java.text.DecimalFormat;
import org.eredlab.g4.ccl.id.FormatSequenceExcepiton;
import org.eredlab.g4.ccl.id.SequenceFormater;

public class DefaultSequenceFormater
  implements SequenceFormater
{
  private String pattern;

  public String format(long pSequence)
    throws FormatSequenceExcepiton
  {
    DecimalFormat df = new DecimalFormat(this.pattern);
    return df.format(pSequence);
  }

  public String getPattern() {
    return this.pattern;
  }

  public void setPattern(String pattern) {
    this.pattern = pattern;
  }
}