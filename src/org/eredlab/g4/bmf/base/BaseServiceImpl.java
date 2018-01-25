package org.eredlab.g4.bmf.base;

import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;

public class BaseServiceImpl
        implements BaseService {
    protected IDao g4Dao;
    protected static PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");

    public void setG4Dao(IDao g4Dao) {
        this.g4Dao = g4Dao;
    }
}