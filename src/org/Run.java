package org;

import org.eredlab.g4.rif.server.G4Server;

public class Run
{
  public static void main(String[] args)
  {
    G4Server server = new G4Server(
      "E:\\G4\\svn\\web\\WebRoot", 
      "/G4Studio", 
      8899);

    server.stop();
    try {
      server.start();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}