package org.eredlab.g4.ccl.id.test;

import java.io.PrintStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;
import org.eredlab.g4.ccl.id.sequence.DefaultSequenceGenerator;
import org.eredlab.g4.ccl.id.sequence.TimeRollingSequenceGenerator;

public class Hello
{
  private static final Log logger = LogFactory.getLog(Hello.class);

  public static void main(String[] args)
  {
    DefaultIDGenerator generator = new DefaultIDGenerator();
    DefaultSequenceGenerator sequenceGenerator = 
      TimeRollingSequenceGenerator.getDayRollingSequenceGenerator();
    sequenceGenerator.setMinValue(1000000L);
    sequenceGenerator.setMaxValue(9999999L);
    generator.setSequenceGenerator(sequenceGenerator);
    System.out.println(generator.create());
    System.out.println(generator.create());
    logger.debug("dddddddddddd");
  }
}