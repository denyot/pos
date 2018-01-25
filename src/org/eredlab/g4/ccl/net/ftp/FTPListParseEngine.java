package org.eredlab.g4.ccl.net.ftp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;

public class FTPListParseEngine
{
  private List entries = new LinkedList();
  private ListIterator _internalIterator = this.entries.listIterator();

  FTPFileEntryParser parser = null;

  public FTPListParseEngine(FTPFileEntryParser parser) {
    this.parser = parser;
  }

  public void readServerList(InputStream stream, String encoding)
    throws IOException
  {
    this.entries = new LinkedList();
    readStream(stream, encoding);
    this.parser.preParse(this.entries);
    resetIterator();
  }

  /** @deprecated */
  public void readServerList(InputStream stream)
    throws IOException
  {
    readServerList(stream, null);
  }

  private void readStream(InputStream stream, String encoding)
    throws IOException
  {
    BufferedReader reader;
    if (encoding == null)
    {
      reader = new BufferedReader(new InputStreamReader(stream));
    }
    else
    {
      reader = new BufferedReader(new InputStreamReader(stream, encoding));
    }

    String line = this.parser.readNextEntry(reader);

    while (line != null)
    {
      this.entries.add(line);
      line = this.parser.readNextEntry(reader);
    }
    reader.close();
  }

  public FTPFile[] getNext(int quantityRequested)
  {
    List tmpResults = new LinkedList();
    int count = quantityRequested;
    while ((count > 0) && (this._internalIterator.hasNext())) {
      String entry = (String)this._internalIterator.next();
      FTPFile temp = this.parser.parseFTPEntry(entry);
      tmpResults.add(temp);
      count--;
    }
    return (FTPFile[])tmpResults.toArray(new FTPFile[0]);
  }

  public FTPFile[] getPrevious(int quantityRequested)
  {
    List tmpResults = new LinkedList();
    int count = quantityRequested;
    while ((count > 0) && (this._internalIterator.hasPrevious())) {
      String entry = (String)this._internalIterator.previous();
      FTPFile temp = this.parser.parseFTPEntry(entry);
      tmpResults.add(0, temp);
      count--;
    }
    return (FTPFile[])tmpResults.toArray(new FTPFile[0]);
  }

  public FTPFile[] getFiles()
    throws IOException
  {
    List tmpResults = new LinkedList();
    Iterator iter = this.entries.iterator();
    while (iter.hasNext()) {
      String entry = (String)iter.next();
      FTPFile temp = this.parser.parseFTPEntry(entry);
      tmpResults.add(temp);
    }
    return (FTPFile[])tmpResults.toArray(new FTPFile[0]);
  }

  public boolean hasNext()
  {
    return this._internalIterator.hasNext();
  }

  public boolean hasPrevious()
  {
    return this._internalIterator.hasPrevious();
  }

  public void resetIterator()
  {
    this._internalIterator = this.entries.listIterator();
  }
}