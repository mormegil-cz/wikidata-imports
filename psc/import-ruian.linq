<Query Kind="Program">
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.FileSystem.dll</Reference>
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>System.Globalization</Namespace>
  <Namespace>System.IO.Compression</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

const string PATH = @"y:\_mine\wikidata-imports\psc\";
const string IMPORT_CSV = @"20210430_OB_ADR_csv.zip";
const string IMPORT_CSV_DATE = "2021-04-30";
const string IMPORT_DATE = "2021-05-20";

void Main()
{
	var cp1250 = Encoding.GetEncoding(1250);
	
	// RUIAN -> QID
	var itemForRuian = new Dictionary<int, string>();
	// RUIAN -> [known PSČ]
	var itemsWithZips = new Dictionary<int, HashSet<string>>();
	// QID -> [new/missing PSČ]
	var zipsForStreet = new Dictionary<string, HashSet<string>>();
	// [unknown RUIAN]
	var unknownRuianIDs = new HashSet<int>();

	ReadWikidataJson(PATH + @"wikidata-ruian-without-zip.json", reader =>
	{
		var itemUri = ReadProperty(reader, "item", "uri");
		var ruian = ReadProperty(reader, "ruian", "literal");
		var qid = itemUri.Substring(itemUri.LastIndexOf('/') + 1);
		itemForRuian.Add(Int32.Parse(ruian, CultureInfo.InvariantCulture), qid);
	});

	ReadWikidataJson(PATH + @"wikidata-ruian-with-zip.json", reader =>
	{
		var itemUri = ReadProperty(reader, "item", "uri");
		var ruian = ReadProperty(reader, "ruian", "literal");
		var zipCode = ReadProperty(reader, "zip", "literal");
		var qid = itemUri.Substring(itemUri.LastIndexOf('/') + 1);
		var ruianID = Int32.Parse(ruian, CultureInfo.InvariantCulture);
		if (!itemsWithZips.TryGetValue(ruianID, out var zipList))
		{
			zipList = new HashSet<string>(3);
			itemsWithZips.Add(ruianID, zipList);
		}
		if (itemForRuian.TryGetValue(ruianID, out var currentForRuian))
		{
			if (currentForRuian != qid) Console.WriteLine("Mismatch for street #{0}: {1} vs {2}", ruianID, currentForRuian, qid);
		}
		else
		{
			itemForRuian.Add(ruianID, qid);
		}
		itemForRuian[ruianID] = qid;
		if (zipCode.Length != 6) Console.WriteLine("Zip '{0}' for street {1} ({2}) is badly formatted", zipCode, ruianID, qid);
		zipList.Add(CleanZip(zipCode));
	});

	// QID -> [currently known/remaining ZIP]
	var itemsWithZipsRemaining = new Dictionary<String, HashSet<string>>(itemsWithZips.Count);
	foreach(var s in itemsWithZips)
	{
		if (!itemForRuian.TryGetValue(s.Key, out var qid))
		{
			Console.WriteLine("Unknown RUIAN {0}!?", s.Key);
			continue;
		}
		if (!itemsWithZipsRemaining.TryGetValue(qid, out var set))
		{
			set = new HashSet<string>(s.Value.Count + 1);
			itemsWithZipsRemaining.Add(qid, set);
		}
		set.UnionWith(s.Value);
	}

	using (var zip = ZipFile.OpenRead(PATH + IMPORT_CSV))
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
					var cleanZip = CleanZip(zipCode);

					if (!itemForRuian.TryGetValue(streetID, out var qid))
					{
						if (!unknownRuianIDs.Contains(streetID))
						{
							Console.WriteLine("Street ID {0} not found", streetID);
							unknownRuianIDs.Add(streetID);
						}
						continue;
					}

					if (itemsWithZips.TryGetValue(streetID, out var alreadyZipSet))
					{
						if (!alreadyZipSet.Contains(cleanZip))
						{
							alreadyZipSet.Add(cleanZip);
							Console.WriteLine("ZIP {0} is missing for street ID {1}", zipCode, streetID);
						}
						else
						{
							itemsWithZipsRemaining[qid].Remove(cleanZip);
							continue;
						}
					}
	
					if (!zipsForStreet.TryGetValue(qid, out var zipList))
					{
						zipList = new HashSet<string>(1);
						zipsForStreet.Add(qid, zipList);
					}
					Console.WriteLine("Adding ZIP {0} for street ID {1} ({2})", zipCode, streetID, qid);
					zipList.Add(FormatZip(zipCode));
				}
			}
		}
	}
	using (var output = new StreamWriter(PATH + @"import-qs\removals.tsv", false, Encoding.UTF8))
	{
		foreach (var e in itemsWithZipsRemaining.Where(r => r.Value.Count > 0))
		{
			Console.WriteLine("Street {0} has zips {1} it should not have", e.Key, String.Join(", ", e.Value));
			foreach (var zip in e.Value)
			{
				output.WriteLine($"-{e.Key}\tP281\t\"{FormatZip(zip)}\"");
			}
		}
	}

	using (var output = new StreamWriter(PATH + @"streetzips.txt", false, Encoding.UTF8))
	{
		foreach (var street in zipsForStreet.OrderBy(p => p.Key))
		{
			output.WriteLine($"{street.Key};{String.Join(", ", street.Value.OrderBy(v => v))}");
		}
	}

	foreach (var group in zipsForStreet.OrderBy(p => p.Key).Select((p, i) => (Key: p.Key, Value: p.Value, Index: i)).GroupBy(p => p.Index / 2000))
	{
		using (var output = new StreamWriter(PATH + $@"import-qs\{group.Key}.tsv", false, Encoding.UTF8))
		{
			foreach (var street in group)
			{
				foreach (var zip in street.Value.OrderBy(v => v))
				{
					output.WriteLine($"{street.Key}\tP281\t\"{zip}\"\tS248\tQ12049125\tS577\t+{IMPORT_CSV_DATE}T00:00:00Z/11\tS854\t\"https://vdp.cuzk.cz/vymenny_format/csv/{IMPORT_CSV}\"\tS813\t+{IMPORT_DATE}T00:00:00Z/11");
				}
			}
		}
	}
}

private static string ReadProperty(JsonReader reader, string propertyName, string type)
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

private static void ReadWikidataJson(string filename, Action<JsonTextReader> resultProcessor)
{
	using (var reader = new JsonTextReader(new StreamReader(filename, Encoding.UTF8)))
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
			resultProcessor(reader);
			// EndObject
			reader.Read();
			if (reader.TokenType != JsonToken.EndObject) throw new FormatException();
		}
	}
}

private static string CleanZip(string zipCode) => zipCode.Replace(" ", "").Replace("\u00A0", "");

private static string FormatZip(string zipCode)
{
	zipCode = CleanZip(zipCode);
	if (zipCode.Length != 5) throw new FormatException();
	return zipCode.Insert(3, "\u00A0");
}