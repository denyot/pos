package org.eredlab.g4.ccl.datastructure.impl;

import java.util.Iterator;
import java.util.Set;
import org.eredlab.g4.ccl.datastructure.PKey;
import org.eredlab.g4.ccl.exception.NullAbleException;

public class BasePKey extends BaseDto
  implements PKey
{
  public void validateNullAble()
  {
    if (isEmpty()) {
      try {
        throw new NullAbleException(getClass());
      } catch (NullAbleException e) {
        e.printStackTrace();
        System.exit(0);
      }
    } else {
      Iterator keyIterator = keySet().iterator();
      while (keyIterator.hasNext()) {
        String key = (String)keyIterator.next();
        String value = getAsString(key);
        if ((value == null) || (value.equals("")))
          try {
            throw new NullAbleException(key);
          } catch (NullAbleException e) {
            e.printStackTrace();
            System.exit(0);
          }
      }
    }
  }
}