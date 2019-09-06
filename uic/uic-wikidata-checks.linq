<Query Kind="Program">
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <NuGetReference>Supercluster.KDTree</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Supercluster.KDTree</Namespace>
  <Namespace>System.Globalization</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
</Query>

// Q18180607: Plzeň-Zadní Skvrňany – v SR70 špatné souřadnice: https://www.openstreetmap.org/node/213792082 https://www.openstreetmap.org/node/2466728502 [nehlášený bug!] -> mismatch!!
// Q2194634: Pňovany zastávka – v SR70 špatné souřadnice: https://www.openstreetmap.org/?mlat=49.74743&mlon=13.32637#map=15/49.7476/13.3314 [nehlášený bug!] -> mismatch!
// Q18180139: Bohdíkov – v SR70 úplně blbě [známý bug] -> mismatch!
// Q19366348: Bošice zastávka – v SR70 souřadnice z Bošic [nehlášený bug!] -> mismatch!
// Q19400691: Hořátev – v SR70 souřadnice úplně v prdeli [nehlášený bug!] -> mismatch!
// Q19401238: Petrovice nad Úhlavou – v SR70 souřadnice z Nýrska [nehlášený bug!] -> mismatch!

// Q9369173: Vrbno pod Pradědem zastávka – v SR70 o kousek vedle [známý bug]
// Q18433528: Přeštice-Zastávka – v SR70 o kousek vedle [známý bug]
// Q25411963: Rodinov – v SR70 o kousek vedle [známý bug]
// Q31210494: Mikulov na Moravě – v SR70 vedle [známý bug]
// Q58345873: Kaproun – v SR70 vedle [známý bug]
// Q19401292: Praha-Hlubočepy – v SR70 odkazuje na starou zastávku [nehlášený bug!]
// Q9166740: Baška – v SR70 vedle [známý bug] (jen varování)
// Q25411990: Nekrasín – v SR70 vedle [známý bug] (jen varování)

private const double DEG_TO_RAD = Math.PI / 180.0;

private static readonly HashSet<string> problematicItems = new HashSet<string> {
	// "Q9369173", "Q18433528", "Q25411963", "Q31210494", "Q58345873", "Q19401292", "Q9166740", "Q25411990"
};

void Main()
{
	var codebook = new PointCodebook(@"y:\KdyPojedeVlak\App_Data");
	codebook.Load();

	var wikidataJson = JObject.Parse(File.ReadAllText(@"y:\wikidata-imports\uic\wikidata-stations.json"));
	var wikidataStations = wikidataJson["results"]["bindings"];
	var mapping = new Dictionary<string, string>(wikidataStations.Count());
	int problemCount = 0;
	using (var quickStatements = new StreamWriter(@"y:\wikidata-imports\uic\import-qs.tsv", false, Encoding.UTF8))
	{
		foreach (var station in wikidataStations)
		{
			var name = station["itemLabel"]["value"].Value<string>();
			var item = station["item"]["value"].Value<string>().Substring("http://www.wikidata.org/entity/".Length);
			var lon = Single.Parse(station["lon"]["value"].Value<string>(), NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);
			var lat = Single.Parse(station["lat"]["value"].Value<string>(), NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture);

			if (problematicItems.Contains(item)) continue;

			var nearestPoint = codebook.FindNearest(lat, lon, 1).Single();

			var lonR = DEG_TO_RAD * lon;
			var latR = DEG_TO_RAD * lat;
			var pLonR = DEG_TO_RAD * nearestPoint.Longitude ?? 0;
			var pLatR = DEG_TO_RAD * nearestPoint.Latitude ?? 0;

			var meanLat = (latR + pLatR) / 2.0f;

			var distance = 6378000 * Math.Sqrt(Math.Pow(latR - pLatR, 2) + Math.Pow(Math.Cos(meanLat) * (lonR - pLonR), 2));

			var nameClean = name.ToLower().Replace('\u00A0', ' ').Replace("–", "-").Replace(" – ", "-").Replace(" - ", "-").Replace("železniční stanice", "").Replace("železniční zastávka", "").Replace("zastávka", "").Replace("nádraží", "").Replace("(", "").Replace(")", "").Trim();
			var pointNameClean = nearestPoint.LongName.ToLower().Replace(" - ", "-").Replace("železniční stanice", "").Replace("zastávka", "").Replace("nádraží", "").Replace(", žel.st.", "").Replace("(", "").Replace(")", "").Trim();

/*
			if (distance > 500 || nameClean != pointNameClean)
			{
				Console.WriteLine($"Skipping: {name}\t{item}\t{lon}\t{lat}\t{nearestPoint.LongName}\t{nearestPoint.Longitude}\t{nearestPoint.Latitude}\t{distance:N0}");
				++problemCount;
				continue;
			}
			

			if (distance > 200)
					{
						Console.WriteLine($"{name}\t{item}\t{lon}\t{lat}\t{nearestPoint.LongName}\t{nearestPoint.Longitude}\t{nearestPoint.Latitude}\t{distance}");
						++problemCount;
					}

			if (nameClean != pointNameClean)
			{
				Console.WriteLine($"{name}\t{item}\t{lon}\t{lat}\t{nearestPoint.LongName}\t{nearestPoint.Longitude}\t{nearestPoint.Latitude}\t{distance:N0}");
				++problemCount;
			}
*/

					if (
					distance < 100 &&
					//name != nearestPoint.LongName
					nameClean != pointNameClean
					)
					{
						Console.WriteLine($"{name}\t{item}\t{lon}\t{lat}\t{nearestPoint.LongName}\t{nearestPoint.Longitude}\t{nearestPoint.Latitude}\t{distance:N0}");
						++problemCount;
					}

			/*
					if (distance > 300 && nameClean == pointNameClean)
					{
						Console.WriteLine($"{name}\t{item}\t{lon}\t{lat}\t{nearestPoint.LongName}\t{distance}");
						++problemCount;
					}
			*/

			var info = $"{item} ({name})";
			if (mapping.ContainsKey(nearestPoint.FullIdentifier))
			{
				Console.WriteLine("Duplicate ident '{0}': {1} vs {2}", nearestPoint.FullIdentifier, mapping[nearestPoint.FullIdentifier], info);
				++problemCount;
			}
			else
			{
				mapping.Add(nearestPoint.FullIdentifier, info);
			}
			quickStatements.WriteLine($"{item}\tP722\t\"54{nearestPoint.ID.PadLeft(6, '0').Substring(0, 5)}\"\tS248\tQ65456021\tS577\t+2019-01-01T00:00:00Z/11\tS813\t+{DateTime.UtcNow:yyyy-MM-dd}T00:00:00Z/11");
		}
	}
	if (problemCount > 0) Console.WriteLine("*** TOTAL {0} problem(s) ***", problemCount);
}

public class PointCodebook
{
	private static Regex regexGeoCoordinate = new Regex(@"\s*^[NE]\s*(?<deg>[0-9]+)\s*°\s*(?<min>[0-9]+)\s*'\s*(?<sec>[0-9]+\s*(,\s*([0-9]+)?)?)\s*""\s*$", RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.ExplicitCapture);

	private readonly string path;
	private Dictionary<string, PointCodebookEntry> codebook;
	private KDTree<float, string> tree;

	public PointCodebook(string path)
	{
		this.path = path;
	}

	public void Load()
	{
		if (codebook != null) throw new InvalidOperationException("Already loaded");

		codebook = new Dictionary<string, PointCodebookEntry>();
		LoadCsvData(path, @"SR70-2019-01-01.csv", ';', Encoding.GetEncoding(1250))
			.Select(r => (ID: "CZ:" + r[0].Substring(0, r[0].Length - 1), Row: r))
			.IntoDictionary(codebook, r => r.ID, r => new PointCodebookEntry
			{
				ID = r.Row[0],
				LongName = r.Row[1],
				ShortName = r.Row[2],
				Type = ParsePointType(r.Row[6]),
				Longitude = ParseGeoCoordinate(r.Row[15]),
				Latitude = ParseGeoCoordinate(r.Row[16]),
			});

		// add historical data for missing points
		foreach (var point in LoadCsvData(path, @"SR70-2017-12-10.csv", ';', Encoding.GetEncoding(1250))
			.Select(r => (ID: "CZ:" + r[0].Substring(0, r[0].Length - 1), Row: r)))
		{
			if (codebook.ContainsKey(point.ID)) continue;

			codebook.Add(point.ID, new PointCodebookEntry
			{
				ID = point.ID,
				LongName = point.Row[1],
				ShortName = point.Row[2],
				Type = ParsePointType(point.Row[5]),
			});

			DebugLog.LogDebugMsg("Additional point in old codebook: {0}", point.ID);
		}

		foreach (var row in LoadCsvData(path, @"osm-overpass-stations-2019-07-04.csv", '\t', Encoding.UTF8)
			.Skip(1)
			.Select(r => (Latitude: r[0], Longitude: r[1], ID: r[2], Name: r[3]))
		)
		{
			if (codebook.TryGetValue("CZ:" + row.ID.Substring(0, 5), out var entry)
				&& Single.TryParse(row.Latitude, NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out var latitude)
				&& Single.TryParse(row.Longitude, NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out var longitude)
			)
			{
				if (entry.Latitude == null || entry.Longitude == null)
				{
					entry.Latitude = latitude;
					entry.Longitude = longitude;
					DebugLog.LogDebugMsg("Added coordinates to {0}", row.ID);
				}
				else
				{
					var dist = Math.Abs(entry.Latitude.GetValueOrDefault() - latitude) + Math.Abs(entry.Longitude.GetValueOrDefault() - longitude);
					if (dist > 0.005)
					{
						DebugLog.LogProblem(String.Format(CultureInfo.InvariantCulture, "Suspicious geographical position for point #{0}: {1}, {2} versus {3}, {4}: {5}", row.ID, latitude, longitude, entry.Latitude, entry.Longitude, dist * 40000.0f / 360.0f));
					}
				}
			}
		}

		DebugLog.LogDebugMsg("{0} point(s)", codebook.Count);

		var pointList = codebook.Where(p =>
			p.Value.Latitude != null
			&& (p.Value.Type == PointType.Stop || p.Value.Type == PointType.Station)
			&& !p.Value.LongName.Contains("předjízdné")
			&& !p.Value.LongName.Contains("odjezdová")
			&& !p.Value.LongName.EndsWith("-AWT")
			&& !p.Value.LongName.EndsWith("-KŽC")
			&& !p.Value.LongName.EndsWith("-PDV RAILWAY")
		).ToList();
		var pointIDs = pointList.Select(p => p.Key).ToArray();
		var pointCoordinates = pointList.Select(p => new[] { p.Value.Latitude.GetValueOrDefault(), p.Value.Longitude.GetValueOrDefault() }).ToArray();
		tree = new KDTree<float, string>(2, pointCoordinates, pointIDs, L2Norm);
	}

	private static double L2Norm(float[] x, float[] y)
	{
		double dist = 0;
		for (int i = 0; i < x.Length; i++)
		{
			dist += (x[i] - y[i]) * (x[i] - y[i]);
		}

		return dist;
	}

	public PointCodebookEntry Find(string id)
	{
		codebook.TryGetValue(id, out var result);
		return result;
	}

	public List<PointCodebookEntry> FindNearest(float latitude, float longitude, int neighbors)
	{
		return tree.NearestNeighbors(new[] { latitude, longitude }, neighbors).Select(point => Find(point.Item2)).Where(x => x != null).ToList();
	}

	private static PointType ParsePointType(string typeStr)
	{
		return !pointTypePerName.TryGetValue(typeStr, out var type) ? PointType.Unknown : type;
	}

	private static float? ParseGeoCoordinate(string posStr)
	{
		if (String.IsNullOrEmpty(posStr)) return null;
		var match = regexGeoCoordinate.Match(posStr);
		if (!match.Success) throw new FormatException($"Invalid geographical coordinate '{posStr}'");
		var deg = ParseFloat(match.Groups["deg"].Value);
		var min = ParseFloat(match.Groups["min"].Value);
		var sec = ParseFloat(match.Groups["sec"].Value.Replace(',', '.'));
		return deg + (min / 60.0f) + (sec / 60.0f / 60.0f);
	}

	private static float ParseFloat(string str)
	{
		str = str.Replace(" ", "");
		if (str.EndsWith(".")) str += '0';
		if (!Single.TryParse(str, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out var result))
		{
			throw new FormatException($"Invalid float number: {str}");
		}

		return result;
	}

	private static IEnumerable<string[]> LoadCsvData(string path, string fileName, char fieldSeparator, Encoding encoding)
	{
		using (var stream = new FileStream(Path.Combine(path, fileName), FileMode.Open, FileAccess.Read, FileShare.Read))
		{
			using (var reader = new StreamReader(stream, encoding))
			{
				string line;
				bool firstLine = true;
				while ((line = reader.ReadLine()) != null)
				{
					// TODO: Real CSV processing
					if (line.Contains('"'))
					{
						yield return line.Split(fieldSeparator).Select(field =>
						{
							if (!field.Contains('"')) return field;
							if (field.Length < 2 || field[0] != '"' || field[field.Length - 1] != '"') throw new FormatException($"Invalid or unsupported CSV file: '{field}' at '{line}'");
							if (field.Count(c => c == '"') % 2 != 0) throw new FormatException($"Unsupported CSV file: '{field}' at '{line}'");
							return field.Substring(1, field.Length - 2).Replace("\"\"", "\"");
						}).ToArray();
					}
					else
					{
						if (firstLine)
						{
							firstLine = false;
							continue;
						}

						yield return line.Split(fieldSeparator);
					}
				}
			}
		}
	}

	private static readonly Dictionary<string, PointType> pointTypePerName = new Dictionary<string, PointType>(StringComparer.OrdinalIgnoreCase)
		{
			{"Automatické hradlo", PointType.Point},
			{"Automatické hradlo a zastávka", PointType.Stop},
			{"Automatické hradlo, nákladiště a zastávka", PointType.Stop},
			{"Dopr.body na cizím území (blíže neurčené)", PointType.Point},
			{"Dopravna D3", PointType.Stop},
			{"Dopravna radiobloku", PointType.Stop},
			{"Hláska", PointType.Point},
			{"Hláska a zastávka", PointType.Stop},
			{"Hláska, nákladiště a zastávka", PointType.Stop},
			{"Hradlo", PointType.Point},
			{"Hradlo a zastávka", PointType.Stop},
			{"Hranice infrastruktur", PointType.InnerBoundary},
			{"Hranice oblastí", PointType.InnerBoundary},
			{"Hranice OPŘ totožná s hranicí VÚSC", PointType.InnerBoundary},
			{"Hranice TUDU (začátek nebo konec TUDU)", PointType.InnerBoundary},
			{"Hranice třídy sklonu", PointType.InnerBoundary},
			{"Jiné dopravní body", PointType.Point},
			{"Kolejová křižovatka", PointType.Crossing},
			{"Kolejová skupina stanice nebo jiného DVM", PointType.Stop},
			{"Nákladiště", PointType.Point},
			{"Nákladiště a zastávka", PointType.Stop},
			{"Obvod DVM nebo staniční kolejová skupina se zastávkou", PointType.Stop},
			{"Odbočení ve stanici nebo v jiném DVM", PointType.Crossing},
			{"Odbočení vlečky", PointType.Crossing},
			{"Odbočka (dopravna s kolejovým rozvětvením)", PointType.Crossing},
			{"Odbočka (dopravna) a zastávka", PointType.Stop},
			{"Odbočka (dopravna), nákladiště a zastávka", PointType.Stop},
			{"Odstup nezavěšeného postrku (na širé trati)", PointType.Point},
			{"Samostatné kolejiště vlečky", PointType.Stop},
			{"Samostatné tarif.místo v rámci stanice nebo jiného DVM", PointType.Point},
			{"Skok ve staničení", PointType.Point},
			{"Stanice (z přepravního hlediska blíže neurčená)", PointType.Station},
			{"Státní hranice", PointType.StateBoundary},
			{"Trasovací bod TUDU, SENA", PointType.Point},
			{"Výhybna", PointType.Stop},
			{"Zastávka", PointType.Stop},
			{"Zastávka lanové dráhy", PointType.Point},
			{"Zastávka náhradní autobusové dopravy", PointType.Point},
			{"Zastávka v obvodu stanice", PointType.Stop},
			{"Závorářské stanoviště", PointType.Point}
		};
}

public class PointCodebookEntry
{
	public string ID { get; set; }
	public string LongName { get; set; }
	public string ShortName { get; set; }
	public PointType Type { get; set; }
	public float? Latitude { get; set; }
	public float? Longitude { get; set; }

	public string FullIdentifier => "CZ:" + ID.Substring(0, ID.Length - 1);
}

public enum PointType
{
	Unknown,
	Stop,
	Station,
	InnerBoundary,
	StateBoundary,
	Crossing,
	Siding,
	Point
}

public static class LinqExtensions
{
	public static void IntoDictionary<TSource, TKey, TValue>(
		this IEnumerable<TSource> source, IDictionary<TKey, TValue> destination,
		Func<TSource, TKey> keySelector, Func<TSource, TValue> valueSelector)
	{
		foreach (var item in source)
		{
			var key = keySelector(item);
			destination.Add(keySelector(item), valueSelector(item));
		}
	}
}

public static class DebugLog
{
	public static void LogDebugMsg(params object[] args)
	{
	}
	public static void LogProblem(params object[] args)
	{
	}
}