import os
import json
from collections import Counter

symbolsPath = "C:/Users/adamm/Documents/Github/svg-control-descriptions"
langPath = "C:/Users/adamm/Documents/Github/svg-control-descriptions/symbols/lang.json"
listOfSymbols = []

KIND_ORDER = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]
KIND_MAP = {k: i for i, k in enumerate(KIND_ORDER)}

KIND_REMAP = {
    "V": "I",
    "W": "J",
    "X": "K",
    "Y": "L",
    "Z": "M",
}

with open(langPath, "r", encoding="utf-8") as f:
    lang = json.load(f)

symbolIndex = 0

for key, value in lang.items():
    symbolSvg = ""

    rawKind = value.get("kind")
    if not rawKind:
        continue

    if rawKind in KIND_REMAP:
        rawKind = KIND_REMAP[rawKind]

    if rawKind not in KIND_MAP:
        continue

    symbolKind = KIND_MAP[rawKind]

    for root, dirs, files in os.walk(symbolsPath):
        for file in files:
            if file.startswith(key):
                with open(os.path.join(root, file), "r", encoding="utf-8") as svgFile:
                    symbolSvg = svgFile.read()
                break

    if not symbolSvg:
        continue

    symbolSvg = symbolSvg.replace('<?xml version="1.0"?>', "")
    symbolSvg = symbolSvg.replace(r'="null"', '="0"')

    symbolName = ""
    names = value.get("names", {})
    for langCode, name in names.items():
        if langCode == "en":
            symbolName = name
            if symbolName == "Special item":
                if symbolName not in [s["name"] for s in listOfSymbols]:
                    symbolName = "Special item cross"
                else:
                    symbolName = "Special item circle"
            break

    if not symbolName:
        continue

    symbolId = (
        symbolName.lower()
        .replace(" ", "-")
        .replace("'", "")
        .replace(":", "")
        .replace(";", "")
        .replace(",", "")
        .replace("(", "")
        .replace(")", "")
        .replace("/", "")
    )

    listOfSymbols.append({
        "index": symbolIndex,
        "id": symbolId,
        "name": symbolName,
        "kind": symbolKind,
        "svg": symbolSvg,
    })

duplicates = [
    {**item, "kind": KIND_MAP["E"]}
    for item in listOfSymbols
    if item["kind"] == KIND_MAP["D"]
]

listOfSymbols.extend(duplicates)

sortedSymbols = sorted(listOfSymbols, key=lambda d: d["kind"])

kind_counts = Counter(d["kind"] for d in sortedSymbols)
totalCount = 0

for kind, count in kind_counts.items():
    symbolIndex = 0
    for i in range(count):
        sortedSymbols[totalCount + i]["index"] = symbolIndex
        symbolIndex += 1
    totalCount += count

with open("output.json", "w", encoding="utf-8") as outputFile:
    json.dump(sortedSymbols, outputFile, indent=4, ensure_ascii=False)
