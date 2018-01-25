package org.eredlab.g4.ccl.id.sequence;

import org.eredlab.g4.ccl.id.CreateSequnceException;
import org.eredlab.g4.ccl.id.SequenceStorer;

public abstract class AbstractRollingSequenceGenerator extends DefaultSequenceGenerator
{
  public long next()
    throws CreateSequnceException
  {
    if (isResetCount()) {
      this.currCount = this.minValue;
      this.maxCount = this.currCount;
      this.sequenceStorer.updateMaxValueByFieldName(this.maxCount, getId());
    }
    return super.next();
  }

  protected abstract boolean isResetCount();
}