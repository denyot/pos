package org.eredlab.g4.ccl.id.generator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.id.CreateIDException;
import org.eredlab.g4.ccl.id.IDGenerator;
import org.eredlab.g4.ccl.id.PrefixGenerator;
import org.eredlab.g4.ccl.id.SequenceFormater;
import org.eredlab.g4.ccl.id.SequenceGenerator;
import org.eredlab.g4.ccl.id.sequence.DefaultSequenceGenerator;

public class DefaultIDGenerator
  implements IDGenerator
{
  private PrefixGenerator prefixGenerator;
  private SequenceGenerator sequenceGenerator = new DefaultSequenceGenerator();
  private SequenceFormater sequenceFormater;
  private final Log logger = LogFactory.getLog(DefaultIDGenerator.class);

  public synchronized String create() throws CreateIDException {
    String prefix = this.prefixGenerator == null ? "" : this.prefixGenerator.create();
    this.logger.debug("ID前缀是:[" + prefix + "]");
    long sequence = this.sequenceGenerator.next();
    String strSequence = this.sequenceFormater == null ? new Long(sequence).toString() : this.sequenceFormater
      .format(sequence);
    return prefix + strSequence;
  }

  public void setPrefixGenerator(PrefixGenerator prefixGenerator) {
    this.prefixGenerator = prefixGenerator;
  }

  public void setSequenceGenerator(SequenceGenerator sequenceGenerator) {
    this.sequenceGenerator = sequenceGenerator;
  }

  public void setSequenceFormater(SequenceFormater sequenceFormater) {
    this.sequenceFormater = sequenceFormater;
  }
}