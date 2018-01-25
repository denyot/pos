package org.eredlab.g4.arm.util.idgenerator;

import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;

public class IDHelper
{
  private static DefaultIDGenerator defaultIDGenerator_eventid = null;

  private static DefaultIDGenerator defaultIDGenerator_monitorid = null;

  private static DefaultIDGenerator defaultIDGenerator_xmid = null;

  private static DefaultIDGenerator defaultIDGenerator_codeid = null;

  private static DefaultIDGenerator defaultIDGenerator_exceptionid = null;

  private static DefaultIDGenerator defaultIDGenerator_authorizeid_role = null;

  private static DefaultIDGenerator defaultIDGenerator_paramid = null;

  private static DefaultIDGenerator defaultIDGenerator_roleid = null;

  private static DefaultIDGenerator defaultIDGenerator_authorizeid_usermenumap = null;

  private static DefaultIDGenerator defaultIDGenerator_authorizeid_user = null;

  private static DefaultIDGenerator defaultIDGenerator_userid = null;

  private static DefaultIDGenerator defaultIDGenerator_fileid = null;

  private static DefaultIDGenerator defaultIDGenerator_partid = null;

  private static DefaultIDGenerator defaultIDGenerator_authorizeid_earoleauthorize = null;

//  private static DefaultIDGenerator defaultIDGenerator_authorizeid_eauserauthorize = idGenerator_authorizeid_eauserauthorize.getDefaultIDGenerator();

  static
  {
    IdGenerator idGenerator_eventid = new IdGenerator();
    idGenerator_eventid.setFieldname("EVENTID");
    defaultIDGenerator_eventid = idGenerator_eventid.getDefaultIDGenerator();

    IdGenerator idGenerator_monitorid = new IdGenerator();
    idGenerator_monitorid.setFieldname("MONITORID");
    defaultIDGenerator_monitorid = idGenerator_monitorid.getDefaultIDGenerator();

    IdGenerator idGenerator_xmid = new IdGenerator();
    idGenerator_xmid.setFieldname("XMID");
    defaultIDGenerator_xmid = idGenerator_xmid.getDefaultIDGenerator();

    IdGenerator idGenerator_codeid = new IdGenerator();
    idGenerator_codeid.setFieldname("CODEID");
    defaultIDGenerator_codeid = idGenerator_codeid.getDefaultIDGenerator();

    IdGenerator idGenerator_exceptionid = new IdGenerator();
    idGenerator_exceptionid.setFieldname("EXCEPTIONID");
    defaultIDGenerator_exceptionid = idGenerator_exceptionid.getDefaultIDGenerator();

    IdGenerator idGenerator_authorizeid_role = new IdGenerator();
    idGenerator_authorizeid_role.setFieldname("AUTHORIZEID_ROLE");
    defaultIDGenerator_authorizeid_role = idGenerator_authorizeid_role.getDefaultIDGenerator();

    IdGenerator idGenerator_paramid = new IdGenerator();
    idGenerator_paramid.setFieldname("PARAMID");
    defaultIDGenerator_paramid = idGenerator_paramid.getDefaultIDGenerator();

    IdGenerator idGenerator_roleid = new IdGenerator();
    idGenerator_roleid.setFieldname("ROLEID");
    defaultIDGenerator_roleid = idGenerator_roleid.getDefaultIDGenerator();

    IdGenerator idGenerator_authorizeid_usermenumap = new IdGenerator();
    idGenerator_authorizeid_usermenumap.setFieldname("AUTHORIZEID_USERMENUMAP");
    defaultIDGenerator_authorizeid_usermenumap = idGenerator_authorizeid_usermenumap.getDefaultIDGenerator();

    IdGenerator idGenerator_authorizeid_user = new IdGenerator();
    idGenerator_authorizeid_user.setFieldname("AUTHORIZEID_USER");
    defaultIDGenerator_authorizeid_user = idGenerator_authorizeid_user.getDefaultIDGenerator();

    IdGenerator idGenerator_userid = new IdGenerator();
    idGenerator_userid.setFieldname("USERID");
    defaultIDGenerator_userid = idGenerator_userid.getDefaultIDGenerator();

    IdGenerator idGenerator_fileid = new IdGenerator();
    idGenerator_fileid.setFieldname("FILEID");
    defaultIDGenerator_fileid = idGenerator_fileid.getDefaultIDGenerator();

    IdGenerator idGenerator_partid = new IdGenerator();
    idGenerator_partid.setFieldname("PARTID");
    defaultIDGenerator_partid = idGenerator_partid.getDefaultIDGenerator();

    IdGenerator idGenerator_authorizeid_earoleauthorize = new IdGenerator();
    idGenerator_authorizeid_earoleauthorize.setFieldname("AUTHORIZEID_EAROLEAUTHORIZE");
    defaultIDGenerator_authorizeid_earoleauthorize = idGenerator_authorizeid_earoleauthorize.getDefaultIDGenerator();

    IdGenerator idGenerator_authorizeid_eauserauthorize = new IdGenerator();
    idGenerator_authorizeid_eauserauthorize.setFieldname("PARTID");
  }

  public static String getEventID()
  {
    return defaultIDGenerator_eventid.create();
  }

  public static String getMonitorID()
  {
    return defaultIDGenerator_monitorid.create();
  }

  public static String getXmID()
  {
    return defaultIDGenerator_xmid.create();
  }

  public static String getCodeID()
  {
    return defaultIDGenerator_codeid.create();
  }

  public static String getExceptionID()
  {
    return defaultIDGenerator_exceptionid.create();
  }

  public static String getAuthorizeid4Role()
  {
    return defaultIDGenerator_authorizeid_role.create();
  }

  public static String getParamID()
  {
    return defaultIDGenerator_paramid.create();
  }

  public static String getRoleID()
  {
    return defaultIDGenerator_roleid.create();
  }

  public static String getAuthorizeid4Usermenumap()
  {
    return defaultIDGenerator_authorizeid_usermenumap.create();
  }

  public static String getAuthorizeid4User()
  {
    return defaultIDGenerator_authorizeid_user.create();
  }

  public static String getUserID()
  {
    return defaultIDGenerator_userid.create();
  }

  public static String getFileID()
  {
    return defaultIDGenerator_fileid.create();
  }

  public static String getPartID()
  {
    return defaultIDGenerator_partid.create();
  }

  public static String getAuthorizeid4Earoleauthorize()
  {
    return defaultIDGenerator_authorizeid_earoleauthorize.create();
  }

//  public static String getAuthorizeid4Eauserauthorize()
//  {
//    return defaultIDGenerator_authorizeid_eauserauthorize.create();
//  }
}