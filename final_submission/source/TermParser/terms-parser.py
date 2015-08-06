import json

def parseProgrammingTerms(filename):
    with open (filename) as f:
        termsList = []
        content = f.readlines()
        for index, line in enumerate(content):
            if len(content[index]) < 35 and content[index][0] != (' ' or '\n' or ' \n'):
                if len(line.rstrip()) != 0:
                    termsList.append(line.rstrip());

        f.close() 
    return termsList

def parseProgrammingLanguages(filename):
    languagesList = []
    with open (filename) as f:
        languages = f.readlines()
        for line in languages:
            languagesList.append(line.split('. ')[1].rstrip())
        f.close()
    return languagesList 

def writeJSONToFile(data, outfile):
    with open (outfile, 'w') as w:
        json.dump(data, w)
        w.close()

def sanitizeTerms(termsList):
    for index, term in enumerate(termsList):
        term = term.replace(' ', '')
        term = ''.join(e for e in term if e.isalnum())
        termsList[index] = term
    return termsList

def writeTermsToFile(outfile, termsFile, languagesFile):
    terms = parseProgrammingTerms(termsFile)
    languages = parseProgrammingLanguages(languagesFile)
    searchCriterion = terms + languages;
    searchCriterion = sanitizeTerms(searchCriterion);

    laguages = sanitizeTerms(languages);

    writeJSONToFile(languages, './languages.json')
    writeJSONToFile(searchCriterion, outfile)

termsFile = '../data/programmingTerms' 
languagesFile = '../data/programmingLanguages' 
outputFile = './terms.json'

writeTermsToFile(outputFile, termsFile, languagesFile)
