<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.FileSystem.dll</Reference>
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>System.Globalization</Namespace>
  <Namespace>System.IO.Compression</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

void Main()
{
	var cp1250 = Encoding.GetEncoding(1250);
	
	var itemForRuian = new Dictionary<int, string>();
	var zipsForStreet = new Dictionary<string, HashSet<string>>();
	var unknownRuianIDs = new HashSet<int>();
	
	using (var reader = new JsonTextReader(new StreamReader(@"y:\wikidata-imports\psc\wikidata-ruian.json", Encoding.UTF8)))
	{
		// StartObject
		reader.Read();
		// PropertyName head
		reader.Read();
		// head {}
		reader.Skip();
		// PropertyName results
		reader.Read();
		// StartObject
		reader.Read();
		// PropertyName bindings
		reader.Read();
		// StartArray
		reader.Read();
		// StartObject
		while (reader.Read() && reader.TokenType == JsonToken.StartObject)
		{
			var itemUri = ReadProperty(reader, "item", "uri");
			var ruian = ReadProperty(reader, "ruian", "literal");
			var qid = itemUri.Substring(itemUri.LastIndexOf('/') + 1);
			itemForRuian.Add(Int32.Parse(ruian, CultureInfo.InvariantCulture), qid);
			// EndObject
			reader.Read();
			if (reader.TokenType != JsonToken.EndObject) throw new FormatException();
		}
	}
	
	using (var zip = ZipFile.OpenRead(@"y:\wikidata-imports\psc\20190630_OB_ADR_csv.zip"))
	{
		foreach (var entry in zip.Entries)
		{
			using (var csv = new StreamReader(entry.Open(), cp1250))
			{
				// skip header
				csv.ReadLine();
	
				string line;
				while ((line = csv.ReadLine()) != null)
				{
					if (line.Contains("\"")) throw new FormatException("Escaped CSV values not supported");
					var fields = line.Split(';');
					var streetIDStr = fields[9];
					var zipCode = fields[15];
					if (streetIDStr.Length == 0) continue;
					if (zipCode.Length != 5 || streetIDStr.Length < 2 || streetIDStr.Length > 7) throw new FormatException($"Unexpected values: '{streetIDStr}' '{zipCode}' at '{entry.Name}': '{line}'");
					Int32.Parse(zipCode, CultureInfo.InvariantCulture);
					var streetID = Int32.Parse(streetIDStr, CultureInfo.InvariantCulture);

					if (!itemForRuian.TryGetValue(streetID, out var qid))
					{
						if (!unknownRuianIDs.Contains(streetID))
						{
							Console.WriteLine("Street ID {0} not found", streetID);
							unknownRuianIDs.Add(streetID);
						}
						continue;
					}
	
					if (!zipsForStreet.TryGetValue(qid, out var zipList))
					{
						zipList = new HashSet<string>(1);
						zipsForStreet.Add(qid, zipList);
					}
					zipList.Add(zipCode);
				}
			}
		}
	}
	
	using (var output = new StreamWriter(@"y:\wikidata-imports\psc\streetzips.txt", false, Encoding.UTF8))
	{
		foreach (var street in zipsForStreet.OrderBy(p => p.Key))
		{
			output.WriteLine($"{street.Key};{String.Join(", ", street.Value.OrderBy(v => v))}");
		}
	}
	
}

string ReadProperty(JsonReader reader, string propertyName, string type)
{
	// PropertyName propertyName
	reader.Read();
	if (reader.TokenType != JsonToken.PropertyName || (string)reader.Value != propertyName) throw new FormatException($"'{propertyName}' expected, {reader.TokenType} '{reader.Value}' found");
	// StartObject
	reader.Read();
	// PropertyName type
	reader.Read();
	if (reader.TokenType != JsonToken.PropertyName || (string)reader.Value != "type") throw new FormatException();
	// String type
	reader.Read();
	if (reader.TokenType != JsonToken.String || (string)reader.Value != type) throw new FormatException($"'{type}' type expected, '{reader.Value}' found");
	// PropertyName value
	reader.Read();
	if (reader.TokenType != JsonToken.PropertyName || (string)reader.Value != "value") throw new FormatException();
	// String value
	reader.Read();
	if (reader.TokenType != JsonToken.String) throw new FormatException();
	var result = (string)reader.Value;
	// EndObject
	reader.Read();
	if (reader.TokenType != JsonToken.EndObject) throw new FormatException();
	return result;
}
