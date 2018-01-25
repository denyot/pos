package org.eredlab.g4.bmf.base;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.exception.G4Exception;
import org.eredlab.g4.ccl.exception.PrcException;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.springframework.orm.ibatis.SqlMapClientTemplate;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class IDaoImpl extends SqlMapClientDaoSupport
        implements IDao {
    private static Log log = LogFactory.getLog(IDaoImpl.class);

    public void insert(String statementName, Object parameterObject) {
        getSqlMapClientTemplate().insert(statementName, parameterObject);
    }

    public void insert(String statementName) {
        getSqlMapClientTemplate().insert(statementName, new BaseDto());
    }

    public Object queryForObject(String statementName, Object parameterObject) {
        return getSqlMapClientTemplate().queryForObject(statementName, parameterObject);
    }

    public Object queryForObject(String statementName) {
        return getSqlMapClientTemplate().queryForObject(statementName, new BaseDto());
    }

    public List queryForList(String statementName, Object parameterObject) {
        return getSqlMapClientTemplate().queryForList(statementName, parameterObject);
    }

    public List queryForList(String statementName) {
        return getSqlMapClientTemplate().queryForList(statementName, new BaseDto());
    }

    public List queryForPage(String statementName, Dto qDto)
            throws SQLException {
        Connection connection = getConnection();
        String dbNameString = connection.getMetaData().getDatabaseProductName().toLowerCase();
        try {
            connection.close();
        } catch (Exception e) {
            log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n未正常关闭数据库连接");
            e.printStackTrace();
        }
        String start = qDto.getAsString("start");
        String limit = qDto.getAsString("limit");
        int startInt = 0;
        if (G4Utils.isNotEmpty(start)) {
            startInt = Integer.parseInt(start);
            if (dbNameString.indexOf("ora") > -1)
                qDto.put("start", Integer.valueOf(startInt + 1));
            else if (dbNameString.indexOf("mysql") > -1)
                qDto.put("start", Integer.valueOf(startInt));
            else {
                qDto.put("start", Integer.valueOf(startInt));
            }
        }
        if (G4Utils.isNotEmpty(limit)) {
            int limitInt = Integer.parseInt(limit);
            if (dbNameString.indexOf("ora") > -1)
                qDto.put("end", Integer.valueOf(limitInt + startInt));
            else if (dbNameString.indexOf("mysql") > -1)
                qDto.put("end", Integer.valueOf(limitInt));
            else {
                qDto.put("end", Integer.valueOf(limitInt));
            }
        }

        Integer intStart = qDto.getAsInteger("start");
        Integer end = qDto.getAsInteger("end");
        if ((G4Utils.isEmpty(start)) || (G4Utils.isEmpty(end))) {
            try {
                throw new G4Exception(
                        "您正在使用分页查询,但是你传递的分页参数缺失!如果不需要分页操作,您可以尝试使用普通查询:queryForList()方法");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return getSqlMapClientTemplate().queryForList(statementName, qDto,
                intStart.intValue(), end.intValue());
    }

    public int update(String statementName, Object parameterObject) {
        return getSqlMapClientTemplate().update(statementName, parameterObject);
    }

    public int update(String statementName) {
        return getSqlMapClientTemplate().update(statementName, new BaseDto());
    }

    public int delete(String statementName, Object parameterObject) {
        return getSqlMapClientTemplate().delete(statementName, parameterObject);
    }

    public int delete(String statementName) {
        return getSqlMapClientTemplate().delete(statementName, new BaseDto());
    }

    public void callPrc(String prcName, Dto prcDto)
            throws PrcException {
        PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
        String callPrcSuccessFlag = pHelper.getValue("callPrcSuccessFlag", "1");
        if (G4Utils.defaultJdbcTypeMysql())
            getSqlMapClientTemplate().insert(prcName, prcDto);
        else {
            getSqlMapClientTemplate().queryForObject(prcName, prcDto);
        }
        if (G4Utils.isEmpty(prcDto.getAsString("appCode"))) {
            throw new PrcException(prcName, "存储过程没有返回状态码appCode");
        }
        if (!prcDto.getAsString("appCode").equals(callPrcSuccessFlag))
            throw new PrcException(prcName, prcDto.getAsString("appCode"), prcDto.getAsString("errorMsg"));
    }

    public void callPrc(String prcName, Dto prcDto, String successFlag)
            throws PrcException {
        if (G4Utils.defaultJdbcTypeMysql())
            getSqlMapClientTemplate().insert(prcName, prcDto);
        else {
            getSqlMapClientTemplate().queryForObject(prcName, prcDto);
        }
        if (G4Utils.isEmpty(prcDto.getAsString("appCode"))) {
            throw new PrcException(prcName, "存储过程没有返回状态码appCode");
        }
        if (!prcDto.getAsString("appCode").equals(successFlag))
            throw new PrcException(prcName, prcDto.getAsString("appCode"), prcDto.getAsString("errorMsg"));
    }

    public Connection getConnection()
            throws SQLException {
        return getSqlMapClientTemplate().getDataSource().getConnection();
    }

    public DataSource getDataSourceFromSqlMap()
            throws SQLException {
        return getSqlMapClientTemplate().getDataSource();
    }

    public SqlMapClientTemplate getSqlMapClientTpl() {
        return getSqlMapClientTemplate();
    }
}