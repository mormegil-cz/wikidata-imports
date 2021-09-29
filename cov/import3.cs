static readonly Regex redirectRegex = new Regex("^https://www.olympijskytym.cz/athlete/([1-9][0-9]*)$", RegexOptions.CultureInvariant);
static HttpClient client;
static readonly Regex contentRegex = new Regex("<a href=\"/video/1502\\?athlete=([1-9][0-9]*)\"", RegexOptions.CultureInvariant);

List<string> okRecords;
List<string> failRecords;

TextWriter okWriter;
TextWriter failWriter;

async Task Main()
{
	okRecords = new List<string>();
	failRecords = new List<string>();

	client = new HttpClient(new WebRequestHandler { AllowAutoRedirect = false });
	client.DefaultRequestHeaders.UserAgent.ParseAdd("Wikidata-COV-Fix/1.0");
	client.DefaultRequestHeaders.From = "mormegil@centrum.cz";

	var athletes = new List<Athlete>();
	var athletesPerOldCovid = new Dictionary<string, Athlete>();
	using (var inputFile = new StreamReader(@"c:\Users\petrk\Downloads\wikidata-covid-mapping.tsv", Encoding.UTF8))
	{
		string line;
		while ((line = inputFile.ReadLine()) != null)
		{
			var lineFields = line.Split('\t');
			var wikidata = lineFields[0];
			var fullName = lineFields[1];
			var covid = lineFields[2];

			var athlete = new Athlete { Wikidata = wikidata, FullName = fullName, OldCovid = covid };
			athletes.Add(athlete);
			athletesPerOldCovid.Add(covid, athlete);
		}
	}

	var namesToProcess = new Dictionary<string, Athlete>();
	var problematicNames = new HashSet<string>();

	using (okWriter = new StreamWriter(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-success-3.csv", false, Encoding.UTF8))
	using (failWriter = new StreamWriter(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-errors-3.csv", false, Encoding.UTF8))
	{
		using (var inputFile = new StreamReader(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-errors-2.csv", Encoding.UTF8))
		{
			string line;
			while ((line = inputFile.ReadLine()) != null)
			{
				var lineFields = line.Split(';');
				var wikidata = lineFields[0];
				var covid = lineFields[1];
				var message = lineFields[2];

				var athlete = athletesPerOldCovid[covid];
				var fullName = athlete.FullName;
				var name = NameToUrlFragment(fullName).Replace("-", "--");
				if (namesToProcess.ContainsKey(name))
				{
					failWriter.WriteLine($"{wikidata};{covid};Multiple athletes named {fullName}: {namesToProcess[name].OldCovid}");
					problematicNames.Add(name);
				}
				else
				{
					namesToProcess.Add(name, athlete);
				}
			}
		}

		Console.WriteLine($"{namesToProcess.Count} athletes to resolve");

		foreach (var athlete in namesToProcess.Values)
		{
			okWriter.Flush();
			failWriter.Flush();
			if (problematicNames.Contains(NameToUrlFragment(athlete.FullName).Replace("-", "--")))
			{
				Console.WriteLine($"Skipping #{athlete.OldCovid} ('{athlete.FullName}')");
				continue;
			}
			await ProcessIdFromName(athlete);
		}
	}

	// failRecords.Add($"{wikidata};{covid};{error}");

	// File.WriteAllLines(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-success--.csv", okRecords.ToArray());
	// File.WriteAllLines(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-errors--.csv", failRecords.ToArray());
}

async Task<(string, string)> ResolveRedirect(string covid, string fullName, string wikidata)
{
	Console.WriteLine($"Processing #{covid}: {fullName}");

	var url = $"https://www.olympic.cz/sportovec/{covid}--{NameToUrlFragment(fullName)}";

	var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, url));
	string error = "?";
	if (response.StatusCode == HttpStatusCode.MovedPermanently)
	{
		var redirectedTo = response.Headers.GetValues("Location").SingleOrDefault();
		if (redirectedTo != null)
		{
			var match = redirectRegex.Match(redirectedTo);
			if (match.Success)
			{
				var newid = match.Groups[1].Value;
				return ($"{wikidata};{covid};{newid}", null);
			}
			else
			{
				error = "Unexpected redirect: " + redirectedTo;
			}
		}
		else
		{
			error = "No location header";
		}
	}
	else
	{
		error = response.StatusCode.ToString();
	}
	return (null, error);
}

async Task ProcessIdFromName(Athlete athlete)
{
	Console.WriteLine($"Processing #{athlete.OldCovid}: {athlete.FullName}");

	var url = $"https://www.olympijskytym.cz/athlete/{NameToUrlFragment(athlete.FullName).Replace("-", "--")}";

	var response = await client.GetAsync(url);
	if (response.StatusCode == HttpStatusCode.OK)
	{
		var content = await response.Content.ReadAsStringAsync();
		var match = contentRegex.Match(content);
		if (match.Success)
		{
			var newid = match.Groups[1].Value;
			okWriter.WriteLine($"{athlete.Wikidata};{athlete.OldCovid};{newid}");
		}
		else
		{
			failWriter.WriteLine($"{athlete.Wikidata};{athlete.OldCovid};Could not scrape content from {url}");
		}
	}
	else
	{
		if (response.Headers.Contains("Location"))
		{
			var redirectedTo = response.Headers.GetValues("Location").SingleOrDefault();
			failWriter.WriteLine($"{athlete.Wikidata};{athlete.OldCovid};{response.StatusCode} ({redirectedTo}) received at {url}");
		}
		else
		{
			failWriter.WriteLine($"{athlete.Wikidata};{athlete.OldCovid};{response.StatusCode} received at {url}");
		}
	}
}

string RemoveDiacritics(string s)
{
	s = s.Normalize(NormalizationForm.FormD);
	var sb = new StringBuilder(s.Length);
	foreach (var c in s)
	{
		if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) sb.Append(c);
	}
	return sb.ToString();
}

string NameToUrlFragment(string fullName) => RemoveDiacritics(fullName).Replace(' ', '-').ToLower();

class Athlete
{
	public string Wikidata;
	public string FullName;
	public string OldCovid;
}
