<Query Kind="Program">
  <Namespace>System.Globalization</Namespace>
</Query>

private static readonly Regex reLine = new Regex("^(?<name>.*?) +(?<routes>([0-9]{3}|T[0-9]|AE0)(, *([0-9]{3}|T[0-9]|AE0))*),?$", RegexOptions.CultureInvariant | RegexOptions.ExplicitCapture);

enum ParseState
{
	Start,
	InsideName,
	InsideRoutes,
}

Dictionary<string, List<string>> routeList;

void Main()
{
	try {
		Run();
	} catch(Exception e)
	{
		//routeList.Dump();
		throw;
	}
}

void Run()
{
	var codebook = new PointCodebook(@"y:\KdyPojedeVlak\App_Data");
	codebook.Load();

	var routes = new Dictionary<string, List<string>>();
	routeList = routes;
	using (var raw = new StreamReader(@"y:\KdyPojedeVlak\App_Data\seznam-stanic-raw.txt", Encoding.UTF8))
	{
		string line;
		string lastName = null;
		string currentLetter = "\u0000";
		ParseState state = ParseState.Start;
		while ((line = raw.ReadLine()) != null)
		{
			if (line == "Vydala Správa železniční dopravní cesty, státní organizace") continue;
			if (line.StartsWith("Jízdní řád 20"))
			{
				line = raw.ReadLine();
				if (!line.StartsWith("Platí od ")) throw new FormatException();
				line = raw.ReadLine();
				if (!Int32.TryParse(line, out var page)) throw new FormatException();
				continue;
			}

			if (line.Length == 0) throw new FormatException();
			var lastChar = line[line.Length - 1];

			//DebugLog.LogDebugMsg($"{state}: '{line}' ('{lastName}')");

			switch (state)
			{
				case ParseState.Start:
					if (line.Length == 1 || line == "CH")
					{
						currentLetter = line;
						break;
					}

					//if (!line.StartsWith(currentLetter, StringComparison.InvariantCultureIgnoreCase)) throw new FormatException($"{currentLetter} expected, '{line}' found");
					lastName = "";
					goto case ParseState.InsideName;

				case ParseState.InsideName:
					if (lastName == null) throw new FormatException();
					if (lastChar == ',' || (lastChar >= '0' && lastChar <= '9'))
					{
						goto case ParseState.InsideRoutes;
					}
					else
					{
						lastName = lastName.EndsWith("-") ? (lastName + line.Trim()).TrimStart() : (lastName + " " + line.Trim()).TrimStart();
						state = ParseState.InsideName;
						break;
					}

				case ParseState.InsideRoutes:
					var entry = lastName.EndsWith("-") ? (lastName + line.Trim()).TrimStart() : (lastName + " " + line.Trim()).TrimStart();
					//Console.WriteLine(entry);
					var match = reLine.Match(entry);
					if (!match.Success) throw new FormatException($"Error parsing '{entry}'");
					lastName = match.Groups["name"].Value.Trim();
					var routesList = match.Groups["routes"].Value.Split(',').Select(r => r.Trim()).ToList();
					var point = codebook.FindByName(lastName);
					if (point == null)
					{
						DebugLog.LogProblem($"Unknown point '{lastName}'");
					}
					else
					{
						if (!routes.TryGetValue(point.ID, out var list))
						{
							list = new List<string>();
							routes.Add(point.ID, list);
						}
						list.AddRange(routesList);
					}

					if (lastChar != ',')
					{
						state = ParseState.Start;
						lastName = null;
					} else {
						state = ParseState.InsideRoutes;
					}
					break;

				default:
					throw new FormatException();
					break;
			}
		}
	}
}

public class PointCodebook
{
	private static Regex regexGeoCoordinate = new Regex(@"\s*^[NE]\s*(?<deg>[0-9]+)\s*°\s*(?<min>[0-9]+)\s*'\s*(?<sec>[0-9]+\s*(,\s*([0-9]+)?)?)\s*""\s*$", RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.ExplicitCapture);

	private readonly string path;
	private Dictionary<string, PointCodebookEntry> codebook;
	private Dictionary<string, PointCodebookEntry> codebookByName;

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

			//DebugLog.LogDebugMsg("Additional point in old codebook: {0}", point.ID);
		}

		DebugLog.LogDebugMsg("{0} point(s)", codebook.Count);

		codebookByName = new Dictionary<string, PointCodebookEntry>(codebook.Count);
		foreach(var p in codebook.Values.Where(p => (p.Type == PointType.Stop || p.Type == PointType.Station) && p.ID.Length == 6))
		{
			codebookByName.Add(p.LongName, p);
			if (!codebookByName.TryGetValue(p.ShortName, out var currentPoint))
			{
				codebookByName.Add(p.ShortName, p);
			} else {
				if (p != currentPoint) throw new FormatException(p.ShortName);
			}
		}
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

	public PointCodebookEntry FindByName(string name)
	{
		codebookByName.TryGetValue(name, out var result);
		return result;
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
			{"Samostatné kolejiště vlečky", PointType.Point},
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
	public static void LogDebugMsg(string msg, params object[] args)
	{
		Console.WriteLine(msg, args);
	}
	public static void LogProblem(string msg, params object[] args)
	{
		Console.WriteLine("***ERROR*** " + msg, args);
	}
}