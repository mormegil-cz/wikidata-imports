using System;
using System.IO;
using System.Xml;

namespace ProcessPropertyHistory
{
    class Program
    {
        private const string NS = "http://www.mediawiki.org/xml/export-0.10/";

        static void Main(string[] args)
        {
            using var fileReader = new StreamReader(@"\wikidata-imports\ProcessPropertyHistory\Template_Property_uses.xml");
            using var reader = XmlReader.Create(fileReader);
            Expect(reader, XmlNodeType.Element, "mediawiki");
            reader.ReadStartElement();
            Expect(reader, XmlNodeType.Element, "siteinfo");
            reader.Skip();
            reader.Read();
            Expect(reader, XmlNodeType.Element, "page");
            reader.ReadStartElement();
            Expect(reader, XmlNodeType.Element, "title");
            reader.Skip();
            Expect(reader, XmlNodeType.Element, "ns");
            reader.Skip();
            Expect(reader, XmlNodeType.Element, "id");
            reader.Skip();
            while (reader.MoveToContent() == XmlNodeType.Element && reader.LocalName == "revision")
            {
                reader.Read();
                Expect(reader, XmlNodeType.Element, "id");
                reader.Skip();
                reader.MoveToContent();
                if (reader.LocalName == "parentid") reader.Skip();
                var timestamp = GetString(reader, "timestamp");
                Expect(reader, XmlNodeType.Element, "contributor");
                reader.ReadStartElement();
                reader.MoveToContent();
                var contributor = GetString(reader, "username");
                Expect(reader, XmlNodeType.Element, "id");
                reader.Skip();
                reader.ReadEndElement();
                Expect(reader, XmlNodeType.Element, "comment");
                reader.Skip();
                Expect(reader, XmlNodeType.Element, "model");
                reader.Skip();
                Expect(reader, XmlNodeType.Element, "format");
                reader.Skip();
                var data = GetString(reader, "text");
                Expect(reader, XmlNodeType.Element, "sha1");
                reader.Skip();
                reader.ReadEndElement();
            }
            Expect(reader, XmlNodeType.EndElement, "page");
            reader.ReadEndElement();
            Expect(reader, XmlNodeType.EndElement, "mediawiki");
            reader.ReadEndElement();
        }

        private static void Expect(XmlReader reader, XmlNodeType nodeType, String name)
        {
            if (reader.MoveToContent() != nodeType) throw new FormatException($"Expected {nodeType} {name}, got {reader.NodeType} {reader.LocalName}");
            if (reader.LocalName != name) throw new FormatException($"Expected {name}, got {reader.LocalName}");
        }

        private static String GetString(XmlReader reader, String expectedElement)
        {
            Expect(reader, XmlNodeType.Element, expectedElement);
            return reader.ReadElementContentAsString();
        }
    }
}