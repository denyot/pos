package org.eredlab.g4.ccl.id.util;

import java.io.PrintStream;
import org.eredlab.g4.ccl.id.fomater.DefaultSequenceFormater;
import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;
import org.eredlab.g4.ccl.id.generator.UUIDGenerator;
import org.eredlab.g4.ccl.id.prefix.DefaultPrefixGenerator;
import org.eredlab.g4.ccl.id.sequence.DefaultSequenceGenerator;

public abstract class IDHelper
{
  private static final UUIDGenerator uuidGenerator = new UUIDGenerator();

  private static final DefaultIDGenerator e3idGenerator = new DefaultIDGenerator();

  static
  {
    DefaultPrefixGenerator prefixGenerator = new DefaultPrefixGenerator();
    prefixGenerator.setWithDate(true);
    e3idGenerator.setPrefixGenerator(prefixGenerator);

    DefaultSequenceGenerator sequenceGenerator = new DefaultSequenceGenerator(
      "net-jcreate-e3-id");
    sequenceGenerator.setMinValue(0L);
    sequenceGenerator.setMaxValue(999999999999L);
    sequenceGenerator.setCycle(true);
    sequenceGenerator.setCache(1000);
    e3idGenerator.setSequenceGenerator(sequenceGenerator);

    DefaultSequenceFormater sequenceFormater = new DefaultSequenceFormater();
    sequenceFormater.setPattern("000000000000");
    e3idGenerator.setSequenceFormater(sequenceFormater);
  }

  public static String uuid()
  {
    return uuidGenerator.create();
  }

  public static String e3id() {
    return e3idGenerator.create();
  }

  public static void main(String[] args) {
    for (int i = 0; i < 100; i++)
      System.out.println(e3id());
  }
}