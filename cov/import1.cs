async Task Main()
{
	var okRecords = new List<string>();
	var failRecords = new List<string>();
	
	var regex = new Regex("^https://www.olympijskytym.cz/athlete/([1-9][0-9]*)$", RegexOptions.CultureInvariant);
	var client = new HttpClient(new WebRequestHandler { AllowAutoRedirect = false });
	client.DefaultRequestHeaders.UserAgent.ParseAdd("Wikidata-COV-Fix/1.0");
	client.DefaultRequestHeaders.From = "mormegil@centrum.cz";
	
	using (var inputFile = new StreamReader(@"c:\Users\petrk\Downloads\wikidata-covid-mapping.tsv", Encoding.UTF8))
	{
		string line;
		while ((line = inputFile.ReadLine()) != null)
		{
			var lineFields = line.Split('\t');
			var wikidata = lineFields[0];
			var fullName = lineFields[1];
			var covid = lineFields[2];
	
			Console.WriteLine($"Processing #{covid}: {fullName}");
	
			var url = $"https://www.olympic.cz/sportovec/{covid}--{RemoveDiacritics(fullName).Replace(' ', '-').ToLower()}";
	
			var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, url));
			string error = "?";
			if (response.StatusCode == HttpStatusCode.MovedPermanently)
			{
				var redirectedTo = response.Headers.GetValues("Location").SingleOrDefault();
				if (redirectedTo != null)
				{
					var match = regex.Match(redirectedTo);
					if (match.Success)
					{
						var newid = match.Groups[1].Value;
						okRecords.Add($"{wikidata};{covid};{newid}");
						error = null;
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
			if (error != null)
			{
				failRecords.Add($"{wikidata};{covid};{error}");
			}
		}
	}
	
	File.WriteAllLines(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-success.csv", okRecords.ToArray());
	File.WriteAllLines(@"c:\Users\petrk\Downloads\wikidata-covid-mapping-errors.csv", failRecords.ToArray());
	
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
