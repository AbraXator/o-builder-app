# Credit: This script uses the https://github.com/perliedman/svg-control-descriptions repository. Thank you!

import os
import json
from collections import Counter

symbolsPath = "C:/Users/adamm/Documents/Github/svg-control-descriptions"
langPath = "C:/Users/adamm/Documents/Github/svg-control-descriptions/symbols/lang.json"
listOfSymbols = []

with open(langPath, "r", encoding="utf-8") as f:
    lang = json.load(f)

for key, value in lang.items():
    symbolId = ""
    symbolName = ""
    symbolKind = ""
    symbolSvg = ""

    for root, dirs, files in os.walk(symbolsPath):
        for file in files:
            if file.startswith(key):
                with open(os.path.join(root, file), "r", encoding="utf-8") as svgFile:
                    symbolSvg = svgFile.read()
                break
    symbolSvg = symbolSvg.replace('<?xml version="1.0"?>', "")

    symbolKind = value.get('kind')

    names = value.get('names', {})
    for lang, name in names.items():
        if lang == "en":
            symbolName = name
            break
        
    symbolId = symbolName.lower().replace(" ", "-").replace("'", "").replace(":", "").replace(";", "").replace(",", "").replace("(", "").replace(")", "").replace("/", "")
    
    dictionary = {
        "id": symbolId,
        "name": symbolName,
        "kind": symbolKind,
        "svg": symbolSvg,
    }
    listOfSymbols.append(dictionary)

duplicates = [
    {**item, "kind": "E"} for item in listOfSymbols if item["kind"] == "D"
]
listOfSymbols.extend(duplicates)

sortedSymbols = sorted(listOfSymbols, key=lambda d: d["kind"])

kind_counts = Counter(d["kind"] for d in sortedSymbols)
for kind, count in kind_counts.items():
  print(f"{kind}: {count}")

with open("output.json", "w", encoding="utf-8") as outputFile:
    json.dump(listOfSymbols, outputFile, indent=4, ensure_ascii=False)