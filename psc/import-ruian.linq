<Query Kind="Statements">
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.FileSystem.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.IO.Compression.dll</Reference>
  <Namespace>System.IO.Compression</Namespace>
  <Namespace>System.Globalization</Namespace>
</Query>

var cp1250 = Encoding.GetEncoding(1250);

var zipsForStreet = new Dictionary<int, HashSet<string>>();

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

				if (!zipsForStreet.TryGetValue(streetID, out var zipList))
				{
					zipList = new HashSet<string>(1);
					zipsForStreet.Add(streetID, zipList);
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
